export interface Test {
  id: number
  label: string
  createdAt: string
  updatedAt: string
  userId: number
  startedAt: string | null
  finishedAt: string | null
  correct: number | null
  percentage: number | null
  items: TestItem[]
}

export interface Category {
  id: number
  label: string
  slug: string
}

export interface Question {
  id: number
  label: string
  imageUrl: string
  correctAnswer?: string
  categories?: {
    category: Category
    categoryId: number
    questionId: number
  }[]
}

export interface TestItem {
  testId: number
  questionId: number
  answer: null | string
  correct: null | boolean
  question: Question
}
