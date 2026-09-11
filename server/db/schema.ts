import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    displayName: text('display_name').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  table => [uniqueIndex('users_email_unique').on(table.email)],
)

export const chunks = sqliteTable(
  'chunks',
  {
    id: text('id').primaryKey(),
    topic: text('topic').notNull(),
    sourceFile: text('source_file').notNull(),
    heading: text('heading'),
    content: text('content').notNull(),
    contentHash: text('content_hash').notNull(),
    timesUsed: integer('times_used').notNull().default(0),
    active: integer('active').notNull().default(1),
    createdAt: integer('created_at').notNull(),
  },
  table => [
    uniqueIndex('chunks_content_hash_unique').on(table.contentHash),
    index('chunks_topic_times_used_idx').on(table.topic, table.timesUsed),
  ],
)

export const questions = sqliteTable(
  'questions',
  {
    id: text('id').primaryKey(),
    chunkId: text('chunk_id')
      .notNull()
      .references(() => chunks.id),
    topic: text('topic').notNull(),
    difficulty: text('difficulty', { enum: ['facil', 'medio', 'dificil'] }).notNull(),
    stem: text('stem').notNull(),
    options: text('options').notNull(),
    correctIndex: integer('correct_index').notNull(),
    explanation: text('explanation').notNull(),
    sourceFile: text('source_file').notNull(),
    reports: integer('reports').notNull().default(0),
    active: integer('active').notNull().default(1),
    createdAt: integer('created_at').notNull(),
  },
  table => [index('questions_active_idx').on(table.active)],
)

export const rounds = sqliteTable(
  'rounds',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    topic: text('topic'),
    gameDate: text('game_date').notNull(),
    startedAt: integer('started_at').notNull(),
    playedAt: integer('played_at'),
    score: integer('score').notNull().default(0),
    correctCount: integer('correct_count').notNull().default(0),
  },
  table => [
    uniqueIndex('rounds_user_id_game_date_unique').on(table.userId, table.gameDate),
    index('rounds_played_at_idx').on(table.playedAt),
  ],
)

export const roundQuestions = sqliteTable('round_questions', {
  id: text('id').primaryKey(),
  roundId: text('round_id')
    .notNull()
    .references(() => rounds.id),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id),
  position: integer('position').notNull(),
  timeLimitMs: integer('time_limit_ms').notNull(),
  servedAt: integer('served_at'),
  chosenIndex: integer('chosen_index'),
  isCorrect: integer('is_correct'),
  points: integer('points'),
  answeredAt: integer('answered_at'),
})

export const seenChunks = sqliteTable(
  'seen_chunks',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    chunkId: text('chunk_id')
      .notNull()
      .references(() => chunks.id),
    seenAt: integer('seen_at').notNull(),
  },
  table => [index('seen_chunks_user_id_seen_at_idx').on(table.userId, table.seenAt)],
)

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
export type Chunk = InferSelectModel<typeof chunks>
export type NewChunk = InferInsertModel<typeof chunks>
export type Question = InferSelectModel<typeof questions>
export type NewQuestion = InferInsertModel<typeof questions>
export type Round = InferSelectModel<typeof rounds>
export type NewRound = InferInsertModel<typeof rounds>
export type RoundQuestion = InferSelectModel<typeof roundQuestions>
export type NewRoundQuestion = InferInsertModel<typeof roundQuestions>
export type SeenChunk = InferSelectModel<typeof seenChunks>
export type NewSeenChunk = InferInsertModel<typeof seenChunks>
