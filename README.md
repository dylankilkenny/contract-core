# Tranchess Core

Tranchess core.

# Local Development

## Install Dependencies

`yarn install`

## Compile Contracts

`yarn hardhat compile`

## Run Tests

`yarn run test`

## Check Lint and Format

`yarn run check`

## Deploy Contracts

### Deployed Contract Address

Each of the following deployment tasks creates a JSON file under the `deployed_addresses` directory,
writing address of all deployed contracts in it.

### Configuration

Copy the file `.env.example` to `.env` and modify configurations in the file.

This project depends on a few external contracts. On a public blockchain, please update
their addresses in `.env`. On a private blockchain, deploy mock contracts using the following
command.

`yarn hardhat deploy_mock --network remote`

### Oracle Contracts

`yarn hardhat deploy_twap_oracle --network remote --token <BTC_TOKEN_ADDR> --oracle-symbol BTC`

`yarn hardhat deploy_bsc_apr_oracle --network remote --token <USDC_TOKEN_ADDR> --v-token <VENUS_V_TOKEN_ADDR>`

On a private blockchain, you may want to modify address files generated by these tasks and
change addresses to mock oracles.

### Governance Contracts

`yarn hardhat deploy_governance --network remote`

### Fund Contracts

`yarn hardhat deploy_fund --network remote --underlying-symbol <BTC_TOKEN_SYMBOL> --quote-symbol <USDC_TOKEN_SYMBOL> --admin-fee-rate 0.5`

It reads address files generated by some previous tasks.

### Exchange Contracts

`yarn hardhat deploy_exchange --network remote --underlying-symbol <BTC_TOKEN_SYMBOL>`

It reads address files generated by some previous tasks.

### Test the Deployment Tasks

The Hardhat task `test_deploy` runs all the above deployment tasks on a temporary local
Hardhat network. It can be used as a preliminary test.

`yarn hardhat test_deploy`

# Test1
