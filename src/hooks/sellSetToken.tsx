import Issue_ABI from '../constants/abis/RebalancingSetIssuanceModule.json';
import SetToken_ABI from '../constants/abis/SetToken.json';
import RSetToken_ABI from '../constants/abis/RebalancingSetTokenV2.json';
import { loadContract } from '../utils';
import { BigNumber } from "@0x/utils";
import { ERC20_ABI } from '../constants/abis/erc20';

const transferProxy_address = "0x882d80d3a191859d64477eb78cca46599307ec1c";
const RebalancingSetIssuanceModule_address = "0xceda8318522d348f1d1aca48b24629b8fbf09020";

export async function sellSetToken(account: any, active: any, library: any, setToken: any, amount: BigNumber, token: any, setSellState: any) {
	if (account && active && library && setToken) {
		setSellState("Calculating...");

		const components = setToken.components;
		console.log("SetToken: ", setToken);
		let includeWETH = false;
		
		for (let item of components) {

			const api_quantity = parseFloat(item.percent_of_set) * parseFloat(item.quantity) / 100;
			if (api_quantity <= 0) {
				continue;
			}		

			if (item.symbol === "WETH") {
				includeWETH = true;

			}
			
		}
		if (amount.isGreaterThan(0)) {
			setSellState("Selling...");
			let issue_con = loadContract(library, Issue_ABI, RebalancingSetIssuanceModule_address);
			if (includeWETH) {
				await issue_con.methods.redeemRebalancingSetUnwrappingEther(setToken.address, amount, false).send({ from: account}).on
					('receipt', (receipt: any) => {
						setSellState("");
						console.log("redeem success");

					}).on('error', (err: any) => {

						setSellState("");
						console.log("redeem failed");

					});
			} else {
				await issue_con.methods.redeemRebalancingSet(setToken.address, amount, false).send({ from: account }).on
					('receipt', (receipt: any) => {
						setSellState("");
						console.log("redeem success");

					}).on('error', (err: any) => {

						setSellState("");
						console.log("redeem failed");

					});
			}



		} else {
			setSellState("");
			return 0;
		}


	} else {
		return 0;
	}

}