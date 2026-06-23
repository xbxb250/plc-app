/**
 * 鏁版嵁璁块棶灞?鈥?Supabase 鏌ヨ灏佽
 *
 * 鎵€鏈夊悗绔氦浜掗兘閫氳繃杩欓噷锛岄〉闈笉鐩存帴鎿嶄綔 supabase
 */

import { supabase } from './supabase'

// ===================== 鏁欑▼鐩稿叧 =====================

/** 鑾峰彇鏁欑▼鍒楄〃 */
export async function fetchTutorials({ category, keyword, page = 1, pageSize = 20 } = {}) {
  let query = supabase
    .from('tutorials')
    .select('*', { count: 'exact' })
    .order('order', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (category) query = query.eq('category', category)
  if (keyword) query = query.ilike('title', `%${keyword}%`)

  const { data, error, count } = await query
  if (error) throw error
  return { data, total: count }
}

/** 鑾峰彇鏁欑▼璇︽儏 */
export async function fetchTutorialDetail(id) {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/** 鑾峰彇鐢ㄦ埛瀛︿範杩涘害 */
export async function fetchUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_tutorial_progress')
    .select('tutorial_id, completed, read_at')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

/** 鏍囪鏁欑▼涓哄凡瀛﹀畬 */
export async function markTutorialComplete(userId, tutorialId) {
  const { data, error } = await supabase
    .from('user_tutorial_progress')
    .upsert({
      user_id: userId,
      tutorial_id: tutorialId,
      completed: true,
      read_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,tutorial_id'
    })

  if (error) throw error
  return data
}

// ===================== 鏀惰棌鐩稿叧 =====================

/** 鑾峰彇鏀惰棌鍒楄〃 */
export async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('tutorial_id, created_at, tutorials(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/** 鍒囨崲鏀惰棌鐘舵€?*/
export async function toggleFavorite(userId, tutorialId, isFavorited) {
  if (isFavorited) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('tutorial_id', tutorialId)
    if (error) throw error
    return false
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, tutorial_id: tutorialId })
    if (error) throw error
    return true
  }
}

// ===================== 棰樺簱鐩稿叧 =====================

/** 鑾峰彇棰樼洰鍒楄〃 */
export async function fetchQuestions({ category, difficulty, page = 1, pageSize = 10 } = {}) {
  let query = supabase
    .from('questions')
    .select('*', { count: 'exact' })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (category) query = query.eq('category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data, error, count } = await query
  if (error) throw error
  return { data, total: count }
}

/** 鎻愪氦绛旈缁撴灉 */
export async function submitAnswer(userId, questionId, selectedOption, isCorrect) {
  const { error } = await supabase
    .from('user_answers')
    .insert({
      user_id: userId,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      answered_at: new Date().toISOString()
    })

  if (error) throw error
}

/** 鑾峰彇閿欓鍒楄〃 */
export async function fetchWrongQuestions(userId) {
  const { data, error } = await supabase
    .from('user_answers')
    .select('question_id, selected_option, is_correct, answered_at, questions(*)')
    .eq('user_id', userId)
    .eq('is_correct', false)
    .order('answered_at', { ascending: false })

  if (error) throw error
  return data || []
}

/** 鑾峰彇绛旈缁熻 */
export async function fetchAnswerStats(userId) {
  const { data, error } = await supabase
    .from('user_answers')
    .select('is_correct')
    .eq('user_id', userId)

  if (error) throw error

  const total = data.length
  const correct = data.filter(d => d.is_correct).length
  const wrong = total - correct

  return {
    total,
    correct,
    wrong,
    correctRate: total > 0 ? Math.round((correct / total) * 100) : 0
  }
}
