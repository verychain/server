import { HttpError } from "@/common/error/errors";

export class ChainService {
  private readonly RELAYER_ADDRESS = process.env.RELAYER_WALLET_ADDRESS || "";
  private readonly RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "";
  private readonly CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS || "";
  private readonly RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "";

  async verifyTokenDeposit(
    txHash: string,
    fixedAmount: number,
    fee: number
  ): Promise<boolean> {
    let receivedAmount: number = 0; // TODO : event 에서 받아올 수량
    let isVerified =
      fixedAmount <= receivedAmount &&
      receivedAmount >= fixedAmount + fixedAmount * fee;
    return isVerified;
  }

  async transferToBuyer() {
    let txHash = "";
    return txHash;
  }

  async refundToSeller(
    sellerId: number,
    fixedAmount: number,
    baseSymbol: string
  ) {
    // 유저 wallet 찾기
    // transfer 실행
  }
}

export const chainService = new ChainService();
