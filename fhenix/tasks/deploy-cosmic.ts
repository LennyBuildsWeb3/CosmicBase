import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

task('deploy-cosmic', 'Deploy CosmicBaseFHE contract').setAction(
	async (_, hre: HardhatRuntimeEnvironment) => {
		const { ethers } = hre
		const [deployer] = await ethers.getSigners()
		console.log('Deploying with:', deployer.address)

		const Contract = await ethers.getContractFactory('CosmicBaseFHE')
		const contract = await Contract.deploy()
		await contract.waitForDeployment()

		const address = await contract.getAddress()
		console.log('CosmicBaseFHE deployed to:', address)
		return address
	}
)
