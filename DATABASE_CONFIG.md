# StudyBuddy 数据库和认证配置指南

## 📋 目录
1. [数据格式要求](#数据格式要求)
2. [Supabase 数据库设置](#supabase-数据库设置)
3. [密码要求](#密码要求)
4. [示例数据](#示例数据)
5. [认证流程](#认证流程)

---

## 数据格式要求

### Student ID
- **格式**：`252FC251LC` (3位数字 + 2位大写字母 + 3位数字 + 2位大写字母)
- **正则表达式**：`^\d{3}[A-Z]{2}\d{3}[A-Z]{2}$`
- **有效示例**：
  - `252FC251LC`
  - `123AB456CD`
  - `999XY001ZW`
- **无效示例**：
  - `252fc251lc` (字母需要大写)
  - `25FC251LC` (前面需要3位数字)
  - `252FC25LC` (数字位数不对)

### Student Email
- **格式**：`student@mmu.edu.my`
- **规则**：必须使用 `@mmu.edu.my` 域名
- **正则表达式**：`^[a-zA-Z0-9._%+-]+@mmu\.edu\.my$`
- **有效示例**：
  - `student@mmu.edu.my`
  - `chai.yi.hao@mmu.edu.my`
  - `chaiyihao@mmu.edu.my`
  - `chai_yi_hao@mmu.edu.my`
- **无效示例**：
  - `student@gmail.com`
  - `student@mmu.com`
  - `student@mmu.co.my`

---

## 密码要求

### 密码强度规则
- **最小长度**：8 个字符
- **必须包含**：
  - ✓ 大写字母 (A-Z)
  - ✓ 小写字母 (a-z)
  - ✓ 数字 (0-9)
  - ✓ 特殊字符 (!@#$%^&*等)

### 密码强度评分
| 评分 | 满足条件 | 说明 |
|------|---------|------|
| 0 | 无 | 无效密码 |
| 1 | 长度 ≥ 8 | 弱 |
| 2 | +大写字母 | 一般 |
| 3 | +数字 | 中等 |
| 4 | +小写字母 | 良好 |
| 5 | +特殊字符 | 很强 |

### 密码示例
- ❌ `password` - 无大写、无数字、无特殊字符
- ❌ `Password` - 无数字、无特殊字符
- ❌ `Password1` - 无特殊字符
- ✓ `Password1!` - 符合所有要求
- ✓ `Secure#Pass123` - 符合所有要求
- ✓ `MyStudy@MMU2024` - 符合所有要求

---

## Supabase 数据库设置

### 步骤 1：在 Supabase 中创建数据库

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 复制并执行 `src/database/init.sql` 中的所有 SQL 语句

### 步骤 2：配置环境变量

编辑 `.env.local` 文件：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

获取这些值：
1. Supabase Dashboard → Project Settings (⚙️)
2. API 部分找到：
   - Project URL
   - Anon public (API Key)

### 步骤 3：配置密码策略

在 Supabase Dashboard 中：
1. 进入 **Authentication** → **Policies**
2. 启用以下设置：
   - Minimum password length: `8`
   - Require uppercase letters: ✓
   - Require numbers: ✓
   - Require special characters: ✓ (推荐)

### 步骤 4：配置邮件模板（可选）

Supabase 会自动发送验证邮件。你可以自定义邮件内容：
1. 进入 **Authentication** → **Email Templates**
2. 自定义注册验证邮件内容

---

## 示例数据

### 数据库表结构

```sql
CREATE TABLE users (
  id              uuid PRIMARY KEY,
  first_name      text NOT NULL,
  last_name       text NOT NULL,
  student_id      text NOT NULL UNIQUE,
  student_email   text NOT NULL UNIQUE,
  email           text NOT NULL UNIQUE,
  created_at      timestamp default now(),
  updated_at      timestamp default now()
);
```

### 示例用户记录

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Chai Yi",
  "last_name": "Hao",
  "student_id": "252FC251LC",
  "student_email": "chaiyihao@mmu.edu.my",
  "email": "chaiyihao@mmu.edu.my",
  "created_at": "2024-05-12T10:30:00Z",
  "updated_at": "2024-05-12T10:30:00Z"
}
```

### 多个示例用户

```json
[
  {
    "first_name": "Chai Yi",
    "last_name": "Hao",
    "student_id": "252FC251LC",
    "student_email": "chaiyihao@mmu.edu.my",
    "email": "chaiyihao@mmu.edu.my"
  },
  {
    "first_name": "Ahmad",
    "last_name": "Hassan",
    "student_id": "252AB251XY",
    "student_email": "ahmad.hassan@mmu.edu.my",
    "email": "ahmad.hassan@mmu.edu.my"
  },
  {
    "first_name": "Sarah",
    "last_name": "Johnson",
    "student_id": "123CD456EF",
    "student_email": "sarah.johnson@mmu.edu.my",
    "email": "sarah.johnson@mmu.edu.my"
  }
]
```

---

## 认证流程

### 注册流程 (Signup)

1. 用户填写注册表单：
   - First Name
   - Last Name
   - Student ID (格式验证)
   - Student Email (格式验证 + 唯一性检查)
   - Password (强度验证)

2. 前端验证通过后，调用 `signUp()` 函数

3. 后端操作：
   - 创建 Supabase Auth 用户
   - 在 `users` 表中创建用户资料
   - 发送验证邮件

4. 用户验证邮件后，可以登录

### 登录流程 (Login)

1. 用户输入邮箱和密码
2. 前端验证表单
3. 调用 `signIn()` 函数
4. Supabase 验证凭证
5. 登录成功 → 跳转到科目选择页面

### 数据保护 (RLS)

- ✓ 用户只能查看自己的数据
- ✓ 用户只能修改自己的数据
- ✓ 用户只能插入自己的数据

---

## 验证规则测试

### 使用验证函数

```typescript
import { validateStudentId, validateStudentEmail, validatePassword } from '@/services/validationService';

// 测试 Student ID
const idTest = validateStudentId('252FC251LC');
console.log(idTest); // { isValid: true, error: null }

// 测试 Student Email
const emailTest = validateStudentEmail('student@mmu.edu.my');
console.log(emailTest); // { isValid: true, error: null }

// 测试密码强度
const pwdTest = validatePassword('MyPassword123!');
console.log(pwdTest); 
// { isValid: true, errors: [], score: 5 }
```

---

## 常见问题

**Q: Student ID 可以是小写吗？**
A: 不可以。格式要求中的字母必须是大写。

**Q: 可以用其他邮箱域名吗？**
A: 不可以。系统只接受 `@mmu.edu.my` 的邮箱。

**Q: 密码可以只包含字母和数字吗？**
A: 不可以。必须包含特殊字符才能达到最高强度。

**Q: Student ID 可以重复吗？**
A: 不可以。数据库中有唯一性约束。

**Q: 忘记密码怎么办？**
A: 使用 "Forgot password" 功能，Supabase 会发送重置邮件。

---

## 注意事项

⚠️ **安全建议**：
- 不要在代码中硬编码 API Key
- 在版本控制中忽略 `.env.local` 文件
- 定期更新 Supabase 依赖
- 启用 2FA 保护 Supabase 账户
