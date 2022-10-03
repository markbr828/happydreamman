import Issue_ABI from '../constants/abis/RebalancingSetIssuanceModule.json';
import SetToken_ABI from '../constants/abis/SetToken.json';
import RSetToken_ABI from '../constants/abis/RebalancingSetTokenV2.json';

import { loadContract } from '../utils';
import { BigNumber } from "@0x/utils";
import { ERC20_ABI } from '../constants/abis/erc20';

const transferProxy_address = "0x882d80d3a191859d64477eb78cca46599307ec1c";
const RebalancingSetIssuanceModule_address = "0xceda8318522d348f1d1aca48b24629b8fbf09020";

export async function buySetToken(account: any, active: any, library: any, setToken: any, amount: BigNumber, token: any, setBuyState: any) {
	if (account && active && library && setToken) {
		setBuyState("Calculating...");

		const components = setToken.components;
		console.log("SetToken: ", setToken);
		let includeWETH = false;
		let WETHQUANTITY = new BigNumber(0);
		let canIssue = false;
		const RSetToken_contract = loadContract(
			library,
			RSetToken_ABI,
			setToken.address
		);
		const setToken_naturalUnit = await RSetToken_contract.methods.naturalUnit().call();
		console.log("setToken_naturalUnit ", setToken_naturalUnit);

		const setToken_unitShare = await RSetToken_contract.methods.unitShares().call();
		console.log("setToken_unitShare ", setToken_unitShare);

		const baseSetToken_address = await RSetToken_contract.methods.currentSet().call();
		console.log("baseSetToken_address ", baseSetToken_address);

		const baseSetToken_contract = loadContract(
			library,
			SetToken_ABI,
			baseSetToken_address
		);
		const baseSetToken_naturalUnit = await baseSetToken_contract.methods.naturalUnit().call();
		console.log("baseSetToken_naturalUnit ", baseSetToken_naturalUnit);

		const baseSetToken_getUnits = await baseSetToken_contract.methods.getUnits().call();
		console.log("baseSetToken_getUnits ", baseSetToken_getUnits);

		const baseSetToken_getComponents = await baseSetToken_contract.methods.getComponents().call();
		console.log("baseSetToken_getComponents ", baseSetToken_getComponents);

		let com_counts = baseSetToken_getComponents.length;
		for (let index = 0; index < com_counts; index++) {

			let contract = loadContract(
				library,
				ERC20_ABI,
				baseSetToken_getComponents[index]
			);

			let item_symbol = '';
			if (baseSetToken_getComponents[index]==='0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'){
				item_symbol = "SAI";
			}else{
				item_symbol = await contract.methods.symbol().call();
			}

			const _allowance = await contract.methods.allowance(account, transferProxy_address).call();
			const allowance = new BigNumber(_allowance);
			console.log(baseSetToken_getComponents[index] + " allowance: ", allowance.toNumber());


			let quantity;

			const component_unit = baseSetToken_getUnits[index];
			let _quantity = amount.div(new BigNumber(setToken_naturalUnit)).times(new BigNumber(setToken_unitShare));
			const mm = _quantity.mod(new BigNumber(baseSetToken_naturalUnit));
			if (mm.isGreaterThan(0)) {
				_quantity = _quantity.minus(mm).plus(new BigNumber(baseSetToken_naturalUnit));
			}
			quantity = _quantity.div(new BigNumber(baseSetToken_naturalUnit)).times(new BigNumber(component_unit));
			
			if (item_symbol === "WETH") {
				includeWETH = true;
				WETHQUANTITY = quantity;
			}
			console.log(item_symbol + " quantity: ", quantity.toNumber());

			if (quantity.isGreaterThan(allowance) && quantity.isGreaterThan(0) && item_symbol !== "WETH") {
				setBuyState("approving " + item_symbol);
				const maxAllowance = new BigNumber(2).pow(256).minus(1);
				await contract.methods.approve(transferProxy_address, maxAllowance.toFixed(0)).send({ from: account }).on('receipt', (receipt: any) => {
					setBuyState("approved " + item_symbol);
					canIssue = true;
				}).on('error', (err: any) => {
					setBuyState("approving " + item_symbol + " failed");
					setBuyState("");
					canIssue = false;
				});
			} else {
				canIssue = true;
			}
			if (!canIssue) {
				break;
			}

		}
		if (canIssue) {
			setBuyState("Buying...");
			let issue_con = loadContract(library, Issue_ABI, RebalancingSetIssuanceModule_address);
			if (includeWETH) {
				await issue_con.methods.issueRebalancingSetWrappingEther(setToken.address, amount, false).send({ from: account, value: WETHQUANTITY }).on
					('receipt', (receipt: any) => {
						setBuyState("");
						console.log("issue success");
					}).on('error', (err: any) => {

						setBuyState("");
						console.log("issue failed");
					});
			} else {
				await issue_con.methods.issueRebalancingSet(setToken.address, amount, false).send({ from: account }).on
					('receipt', (receipt: any) => {
						setBuyState("");
						console.log("issue success");
					}).on('error', (err: any) => {

						setBuyState("");
						console.log("issue failed");
					});
			}



		} else {
			setBuyState("");
		}


	} else {
		return 0;
	}

}