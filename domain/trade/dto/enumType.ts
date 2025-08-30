export enum TradeType {
  BUY = 0,
  SELL = 1,
}

export enum TradeOption {
  BANK_TRANSFER = 0,
  KAKAO_PAY = 1,
  TOSS = 2,
  NAVER_PAY = 3,
  REMITLY = 4,
  PAYSEND = 5,
}

export enum TradeStatus {
  ACTIVE = 0,
  PENDING = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  EXPIRED = 4,
}

export enum TradeHistoryStatus {
  INITIATED = 0, // 거래 세션 시작
  TOKEN_DEPOSITED = 1, // 토큰 예치 완료 (판매자가 변경)
  PAYMENT_CONFIRMED = 2, // 원화 입금 완료 (구매자가 변경)
  COMPLETED = 3, // 거래 완료 (판매자가 변경)
  CANCELLED = 4, // 거래 취소
  FAILED = 5, // 거래 실패 (= 이의 제기)
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum TradeSortField {
  CREATED_AT = "createdAt",
  PRICE = "price",
  USER_GRADE = "grade",
  TRADE_VOLUME = "tradeVolume",
  // MIN_AMOUNT = "minAmount",
  // MAX_AMOUNT = "maxAmount",
}
