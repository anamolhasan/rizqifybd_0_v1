import type { FAQRawItem, FAQCategoryRaw } from "./types"

export const faqCategories: FAQCategoryRaw[] = [
  { id: "all", labelKey: "categories.all" },
  { id: "general", labelKey: "categories.general" },
  { id: "account", labelKey: "categories.account" },
  { id: "offers", labelKey: "categories.offers" },
  { id: "orders", labelKey: "categories.orders" },
  { id: "payments", labelKey: "categories.payments" },
  { id: "agent", labelKey: "categories.agent" },
  { id: "referral", labelKey: "categories.referral" },
  { id: "refunds", labelKey: "categories.refunds" },
]

export const faqData: Record<string, FAQRawItem[]> = {
  general: [
    {
      questionKey: "faq.general.q1",
      answerKey: "faq.general.a1",
    },
    {
      questionKey: "faq.general.q2",
      answerKey: "faq.general.a2",
    },
    {
      questionKey: "faq.general.q3",
      answerKey: "faq.general.a3",
    },
  ],
  account: [
    {
      questionKey: "faq.account.q1",
      answerKey: "faq.account.a1",
    },
    {
      questionKey: "faq.account.q2",
      answerKey: "faq.account.a2",
    },
    {
      questionKey: "faq.account.q3",
      answerKey: "faq.account.a3",
    },
    {
      questionKey: "faq.account.q4",
      answerKey: "faq.account.a4",
    },
  ],
  offers: [
    {
      questionKey: "faq.offers.q1",
      answerKey: "faq.offers.a1",
    },
    {
      questionKey: "faq.offers.q2",
      answerKey: "faq.offers.a2",
    },
    {
      questionKey: "faq.offers.q3",
      answerKey: "faq.offers.a3",
    },
    {
      questionKey: "faq.offers.q4",
      answerKey: "faq.offers.a4",
    },
  ],
  orders: [
    {
      questionKey: "faq.orders.q1",
      answerKey: "faq.orders.a1",
    },
    {
      questionKey: "faq.orders.q2",
      answerKey: "faq.orders.a2",
    },
    {
      questionKey: "faq.orders.q3",
      answerKey: "faq.orders.a3",
    },
    {
      questionKey: "faq.orders.q4",
      answerKey: "faq.orders.a4",
    },
  ],
  payments: [
    {
      questionKey: "faq.payments.q1",
      answerKey: "faq.payments.a1",
    },
    {
      questionKey: "faq.payments.q2",
      answerKey: "faq.payments.a2",
    },
    {
      questionKey: "faq.payments.q3",
      answerKey: "faq.payments.a3",
    },
    {
      questionKey: "faq.payments.q4",
      answerKey: "faq.payments.a4",
    },
    {
      questionKey: "faq.payments.q5",
      answerKey: "faq.payments.a5",
    },
  ],
  agent: [
    {
      questionKey: "faq.agent.q1",
      answerKey: "faq.agent.a1",
    },
    {
      questionKey: "faq.agent.q2",
      answerKey: "faq.agent.a2",
    },
    {
      questionKey: "faq.agent.q3",
      answerKey: "faq.agent.a3",
    },
    {
      questionKey: "faq.agent.q4",
      answerKey: "faq.agent.a4",
    },
  ],
  referral: [
    {
      questionKey: "faq.referral.q1",
      answerKey: "faq.referral.a1",
    },
    {
      questionKey: "faq.referral.q2",
      answerKey: "faq.referral.a2",
    },
    {
      questionKey: "faq.referral.q3",
      answerKey: "faq.referral.a3",
    },
    {
      questionKey: "faq.referral.q4",
      answerKey: "faq.referral.a4",
    },
    {
      questionKey: "faq.referral.q5",
      answerKey: "faq.referral.a5",
    },
  ],
  refunds: [
    {
      questionKey: "faq.refunds.q1",
      answerKey: "faq.refunds.a1",
    },
    {
      questionKey: "faq.refunds.q2",
      answerKey: "faq.refunds.a2",
    },
    {
      questionKey: "faq.refunds.q3",
      answerKey: "faq.refunds.a3",
    },
    {
      questionKey: "faq.refunds.q4",
      answerKey: "faq.refunds.a4",
    },
  ],
}