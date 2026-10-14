export interface FAQItemResolved {
  question: string
  answer: string
  category: string
}

export interface FAQCategory {
  id: string
  labelKey: string
}

export interface FAQRawItem {
  questionKey: string
  answerKey: string
}

export interface FAQCategoryRaw {
  id: string
  labelKey: string
}