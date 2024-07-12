import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("deployFactory", m => {
    let factory = m.contract("Factory");
    return { factory };
});
