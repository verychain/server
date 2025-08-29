import { HttpError } from "@/common/error/errors";
import { ethers } from "ethers";

import coreABI from "@/common/model/abi/coreABI.json";
import treasuryABI from "@/common/model/abi/treasuryABI.json";
import { userRepository } from "@/domain/user/repository/userRepository";

export class ChainService {
  private readonly RELAYER_ADDRESS = process.env.RELAYER_WALLET_ADDRESS || "";
  private readonly RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "";
  private readonly CORE_CONTRACT_ADDRESS =
    process.env.CORE_CONTRACT_ADDRESS || "";
  private readonly TREASURY_CONTRACT_ADDRESS =
    process.env.TREASURY_CONTRACT_ADDRESS || "";
  private readonly RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "";

  private provider: ethers.JsonRpcProvider;
  private coreContract: ethers.Contract;
  private treasuryContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(this.RPC_URL);
    this.coreContract = new ethers.Contract(
      this.CORE_CONTRACT_ADDRESS,
      coreABI,
      this.provider
    );
    this.treasuryContract = new ethers.Contract(
      this.TREASURY_CONTRACT_ADDRESS,
      treasuryABI,
      this.provider
    );
  }

  async verifyTokenDeposit(
    tradeId: number,
    txHash: string,
    fixedAmount: number,
    fee: number
  ): Promise<boolean> {
    try {
      // const currentBlock = await this.provider.getBlockNumber();
      // const events = await this.coreContract.queryFilter(
      //   this.coreContract.filters.Deposted(null, null, null, tradeId)
      // );

      // let receivedAmount: number = 0;
      // for (const event of events) {
      //   const eventLog = event as ethers.EventLog;
      //   const [sender, value, timestamp, tradeID] = eventLog.args;

      //   const amountInEther = Number(ethers.formatEther(value));
      //   receivedAmount += amountInEther;
      // }

      const eventData = await this.parseDepositedEvent(txHash);
      const receivedAmount = Number(ethers.formatEther(eventData.amount));
      if (Number(eventData.tradeId) !== tradeId) {
        console.error(
          `Trade ID mismatch: expected ${tradeId}, got ${eventData.tradeId}`
        );
        return false;
      }

      const isVerified =
        fixedAmount <= receivedAmount &&
        receivedAmount >= fixedAmount + fixedAmount * fee;
      return isVerified;
    } catch (error) {
      console.error("[verifyTokenDeposit@ChainService] Error:", error);
      return false;
    }
  }

  async transferToBuyer(
    tradeId: number,
    sellerId: number,
    buyerId: number
  ): Promise<string> {
    try {
      const wallet = new ethers.Wallet(this.RELAYER_PRIVATE_KEY, this.provider);
      const coreContractWithSigner = this.coreContract.connect(wallet);

      const sellerWallet = await userRepository.findWalletByUserId(sellerId);
      if (!sellerWallet) {
        throw new HttpError("Seller wallet not found", 404);
      }
      const buyerWallet = await userRepository.findWalletByUserId(buyerId);
      if (!buyerWallet) {
        throw new HttpError("Buyer wallet not found", 404);
      }

      const tx = await (coreContractWithSigner as any).confirmTrade(
        sellerWallet.address,
        tradeId,
        buyerWallet.address
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("[transferToBuyer@ChainService] Error:", error);
      throw new HttpError("Failed to transfer to buyer", 500);
    }
  }

  async refundToSeller(tradeId: number, sellerId: number): Promise<string> {
    try {
      const wallet = new ethers.Wallet(this.RELAYER_PRIVATE_KEY, this.provider);
      const coreContractWithSigner = this.coreContract.connect(wallet);

      const tx = await (coreContractWithSigner as any).cancelTrade(
        sellerId,
        tradeId
      );
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error("[refundToSeller@ChainService] Error:", error);
      throw new HttpError("Failed to refund to seller", 500);
    }
  }

  private async parseDepositedEvent(txHash: string) {
    try {
      // receipt 조회
      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) {
        throw new Error(
          `Transaction receipt not found (pending or unknown): ${txHash}`
        );
      }

      // 이벤트 시그니처
      const signature = "Deposited(address,uint256,uint256,uint256)";
      const topic = ethers.id(signature); // keccak256 해시

      // receipt의 로그 중에서 contractAddress + topic 매칭되는 것 찾기
      const log = receipt.logs.find(
        (l) =>
          l.address.toLowerCase() ===
            this.CORE_CONTRACT_ADDRESS.toLowerCase() && l.topics[0] === topic
      );

      if (!log) {
        throw new Error("Deposited event not found in receipt");
      }

      // ABI 정의
      const abi = [
        "event Deposited(address indexed user, uint256 amount, uint256 timestamp, uint256 tradeId)",
      ];
      const iface = new ethers.Interface(abi);

      // 로그 디코딩
      const parsedLog = iface.parseLog(log);

      // 결과 반환
      return {
        user: parsedLog?.args.user as string,
        amount: parsedLog?.args.amount as bigint,
        timestamp: parsedLog?.args.timestamp as bigint,
        tradeId: parsedLog?.args.tradeId as bigint,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export const chainService = new ChainService();
