import { task } from "hardhat/config";
import { createAddressFile, selectAddressFile } from "./address_file";
import { updateHreSigner } from "./signers";

task("deploy_exchange", "Deploy exchange contracts")
    .addOptionalParam("governance", "Path to the governance address file", "")
    .addOptionalParam("fund", "Path to the fund address file", "")
    .setAction(async function (args, hre) {
        await updateHreSigner(hre);
        const { ethers } = hre;

        await hre.run("compile");
        const addressFile = createAddressFile(hre, "exchange");
        const governanceAddresses = await selectAddressFile(hre, "governance", args.governance);

        await hre.run("deploy_impl", {
            governance: args.governance,
            fund: args.fund,
            silent: true,
            deployExchange: true,
        });
        const implAddresses = await selectAddressFile(hre, "impl", "latest");

        const Exchange = await ethers.getContractFactory("Exchange");
        const exchangeImpl = Exchange.attach(implAddresses.exchangeImpl);
        addressFile.set("exchangeImpl", exchangeImpl.address);

        const TransparentUpgradeableProxy = await ethers.getContractFactory(
            "TransparentUpgradeableProxy"
        );
        const exchangeProxy = await TransparentUpgradeableProxy.deploy(
            exchangeImpl.address,
            governanceAddresses.proxyAdmin,
            "0x",
            { gasLimit: 1e6 } // Gas estimation may fail
        );
        const exchange = Exchange.attach(exchangeProxy.address);
        console.log(`Exchange: ${exchange.address}`);
        addressFile.set("exchange", exchange.address);

        const chessSchedule = await ethers.getContractAt(
            "ChessSchedule",
            governanceAddresses.chessSchedule
        );
        if ((await chessSchedule.owner()) === (await chessSchedule.signer.getAddress())) {
            await chessSchedule.addMinter(exchange.address);
            console.log("Exchange is a CHESS minter now");

            console.log("Transfering ownership of ChessSchedule to TimelockController");
            await chessSchedule.transferOwnership(governanceAddresses.timelockController);
        } else {
            console.log("NOTE: Please add Exchange as a minter of ChessSchedule");
        }
    });
