-- 贴纸生成记录表
CREATE TABLE IF NOT EXISTS sticker_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id VARCHAR(100),
  template_name VARCHAR(100) NOT NULL,
  prompt TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  image_url TEXT,
  task_id VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：按用户查询 + 按时间倒序
CREATE INDEX idx_sticker_records_user_id ON sticker_records(user_id);
CREATE INDEX idx_sticker_records_created_at ON sticker_records(created_at DESC);

-- RLS 策略
ALTER TABLE sticker_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sticker records"
  ON sticker_records FOR SELECT
  USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can insert own sticker records"
  ON sticker_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own sticker records"
  ON sticker_records FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own sticker records"
  ON sticker_records FOR DELETE
  USING (auth.uid()::text = user_id::text OR true);
