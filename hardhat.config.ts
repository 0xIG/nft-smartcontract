import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import "hardhat-exposed";

const config: HardhatUserConfig = {
    solidity: "0.8.26",
    gasReporter: {
        enabled: true,
    },
};

export default config;
