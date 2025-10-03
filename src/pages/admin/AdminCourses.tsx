import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useCourses, Course } from '@/modules/courses/hooks/useCourses';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminCourses() {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse, uploadCourseImage } = useCourses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    is_active: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        price: course.price,
        description: course.description || '',
        is_active: course.is_active,
        display_order: course.display_order,
      });
      setImagePreview(course.image_path);
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        price: 0,
        description: '',
        is_active: true,
        display_order: 0,
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imagePath = editingCourse?.image_path || null;

      if (imageFile) {
        imagePath = await uploadCourseImage(imageFile);
      }

      const courseData = {
        ...formData,
        image_path: imagePath,
      };

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await addCourse(courseData);
      }

      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCourseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (courseToDelete) {
      await deleteCourse(courseToDelete);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="コース管理"
        description="予約で選択可能なコースを管理します"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新規追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'コース編集' : 'コース追加'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">コース名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">金額（円）</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">説明文</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">画像</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="プレビュー"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="display_order">表示順序</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">有効</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '保存中...' : '保存'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">画像</th>
                  <th className="text-left p-4 font-medium">コース名</th>
                  <th className="text-left p-4 font-medium">金額</th>
                  <th className="text-left p-4 font-medium">説明</th>
                  <th className="text-left p-4 font-medium">ステータス</th>
                  <th className="text-left p-4 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      {course.image_path ? (
                        <img
                          src={course.image_path}
                          alt={course.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{course.name}</td>
                    <td className="p-4">¥{course.price.toLocaleString()}</td>
                    <td className="p-4 max-w-xs truncate">{course.description || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          course.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {course.is_active ? '有効' : '無効'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(course)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {courses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              コースが登録されていません
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="コースを削除"
        description="このコースを削除してもよろしいですか？この操作は取り消せません。"
        confirmText="削除"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </AdminLayout>
  );
}
