# Supabase 集成设置指南

## 第一步：创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project" 创建新项目
3. 填写项目信息（Organization, Project name, Password 等）
4. 选择地区（建议选择离你最近的区域）
5. 等待项目创建完成

## 第二步：获取 API 密钥

1. 项目创建完成后，进入项目仪表板
2. 点击左侧菜单的 "Project Settings" (齿轮图标)
3. 找到 "API" 部分
4. 复制以下信息：
   - **Project URL** → 填入 `VITE_SUPABASE_URL`
   - **Anon public** (API Key) → 填入 `VITE_SUPABASE_ANON_KEY`

## 第三步：更新 .env.local

打开项目根目录的 `.env.local` 文件，替换占位符：

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 第四步：创建数据库表

在 Supabase 仪表板中：

1. 进入 "SQL Editor" 或 "Table Editor"
2. 执行以下 SQL 创建用户表：

```sql
-- 创建 users 表
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  first_name text not null,
  last_name text not null,
  student_id text not null unique,
  student_email text not null unique,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 启用 RLS (Row Level Security)
alter table public.users enable row level security;

-- 创建 RLS 策略 - 用户只能看到自己的数据
create policy "Users can view their own data"
  on public.users
  for select
  using (auth.uid() = id);

-- 创建 RLS 策略 - 用户可以更新自己的数据
create policy "Users can update their own data"
  on public.users
  for update
  using (auth.uid() = id);
```

3. 可选：创建其他表（主题、问题、答案等）

## 第五步：测试连接

运行以下命令检查 Supabase 是否正确连接：

```bash
npm run dev
```

查看浏览器控制台（F12），如果没有错误信息，说明连接成功。

## 数据库表结构建议

### users 表
- id (UUID, 主键，来自 auth.users)
- first_name (TEXT)
- last_name (TEXT)
- student_id (TEXT, 唯一)
- student_email (TEXT, 唯一)
- email (TEXT, 唯一)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### subjects 表 (后续可添加)
- id (UUID, 主键)
- subject_code (TEXT, 唯一)
- subject_name (TEXT)
- created_at (TIMESTAMP)

### questions 表 (后续可添加)
- id (UUID, 主键)
- user_id (UUID, 外键 → users)
- subject_id (UUID, 外键 → subjects)
- title (TEXT)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## 环境变量注意事项

⚠️ **重要**: 不要在版本控制中提交 `.env.local` 文件！
- 确保 `.gitignore` 包含 `.env.local`
- 生产环境中通过平台的环境变量配置（如 Vercel、Netlify 等）

## 常见问题

**Q: 如何在生产环境中使用?**
A: 在部署平台（如 Vercel）的环境变量设置中添加相同的变量。

**Q: 忘记了 API Key 怎么办?**
A: 在 Supabase 项目的 "Settings" → "API" 中重新生成或重置。

**Q: 如何处理用户认证状态?**
A: 使用 `supabase.auth.onAuthStateChange()` 监听认证状态变化。

## 下一步

1. 将认证函数集成到 `AuthPage` 组件
2. 添加用户状态管理（Context 或 Zustand）
3. 创建更多数据库表用于存储问题、答案等内容
