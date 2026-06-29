'use client'

import { useEffect, useState, useMemo } from 'react'
import { Edit2, Trash2, Loader2, Search, KeyRound, Shield, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  role: string
  createdAt: string
}

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetUser, setResetUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch {
      toast.error('فشل التحميل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      }
      return true
    })
  }, [users, search, roleFilter])

  async function handleSave(data: Partial<User>) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${editing!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'فشل الحفظ')
        return
      }
      toast.success('تم التحديث')
      setEditOpen(false)
      load()
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  async function handleReset(password: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${resetUser!.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'فشل')
        return
      }
      toast.success('تم تغيير كلمة المرور')
      setResetOpen(false)
    } catch {
      toast.error('حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, { method: 'DELETE' })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'فشل الحذف')
        return
      }
      toast.success('تم الحذف')
      setDeleteId(null)
      load()
    } catch {
      toast.error('حدث خطأ')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold font-display">إدارة المستخدمين</h1>
        <p className="text-sm text-muted-foreground">{users.length} مستخدم</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث بالاسم أو البريد..." className="pr-9" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent className="luxury-card">
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="admin">مدراء</SelectItem>
            <SelectItem value="user">مستخدمون</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted/30 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => (
            <Card key={u.id} className="luxury-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8C964] to-[#A8842B] flex items-center justify-center text-black font-bold flex-shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold">{u.name}</span>
                  <Badge variant="outline" className={u.role === 'admin' ? 'border-[#D4AF37]/40 text-[#D4AF37]' : ''}>
                    {u.role === 'admin' ? <><Shield className="ml-1 h-3 w-3" />مدير</> : <><UserIcon className="ml-1 h-3 w-3" />مستخدم</>}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                {u.phone && <div className="text-[10px] text-muted-foreground" dir="ltr">{u.phone}</div>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-amber-500" onClick={() => { setResetUser(u); setResetOpen(true) }} title="إعادة تعيين كلمة المرور">
                  <KeyRound className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-[#D4AF37]" onClick={() => { setEditing(u); setEditOpen(true) }}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={() => setDeleteId(u.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit user */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="luxury-card" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient-gold">تعديل المستخدم</DialogTitle>
            <DialogDescription>{editing?.email}</DialogDescription>
          </DialogHeader>
          {editing && <UserEditForm user={editing} onSave={handleSave} saving={saving} />}
        </DialogContent>
      </Dialog>

      {/* Reset password */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="luxury-card" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient-gold">إعادة تعيين كلمة المرور</DialogTitle>
            <DialogDescription>{resetUser?.email}</DialogDescription>
          </DialogHeader>
          <ResetForm saving={saving} onSave={handleReset} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="luxury-card">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا المستخدم؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function UserEditForm({ user, onSave, saving }: { user: User; onSave: (data: Partial<User>) => void; saving: boolean }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone || '')
  const [role, setRole] = useState(user.role)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ name, email, phone, role }) }} className="space-y-3">
      <div className="space-y-1.5">
        <Label>الاسم</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label>البريد</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label>الهاتف</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
      </div>
      <div className="space-y-1.5">
        <Label>الدور</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="luxury-card">
            <SelectItem value="user">مستخدم</SelectItem>
            <SelectItem value="admin">مدير</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={saving} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          {saving && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
          حفظ
        </Button>
      </DialogFooter>
    </form>
  )
}

function ResetForm({ saving, onSave }: { saving: boolean; onSave: (password: string) => void }) {
  const [password, setPassword] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (password.length >= 6) onSave(password) }} className="space-y-3">
      <div className="space-y-1.5">
        <Label>كلمة المرور الجديدة (6 أحرف على الأقل)</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={saving || password.length < 6} className="bg-[#D4AF37] text-black hover:bg-[#E8C964]">
          {saving && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}
          تغيير
        </Button>
      </DialogFooter>
    </form>
  )
}
