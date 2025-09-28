import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGallery } from '@/modules/gallery/hooks/useGallery';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminGallery() {
  const { images, loading, uploadImage, deleteImage, getImageUrl } = useGallery();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; filePath: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'エラー',
          description: '画像ファイルのみアップロード可能です。',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'エラー',
          description: 'ファイルサイズは5MB以下にしてください。',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: 'エラー',
        description: 'ファイルを選択してください。',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    
    try {
      await uploadImage(selectedFile, caption || undefined);
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error is handled in useGallery hook
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    await deleteImage(deleteConfirm.id, deleteConfirm.filePath);
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="ギャラリー管理" description="レストランの画像を管理">
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              画像をアップロード
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しい画像をアップロード</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-file">画像ファイル</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP形式、5MB以下
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">キャプション（オプション）</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="画像の説明を入力してください"
                />
              </div>
              {selectedFile && (
                <div className="space-y-2">
                  <Label>プレビュー</Label>
                  <div className="border rounded-md p-4">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-w-full max-h-48 object-contain mx-auto"
                    />
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      アップロード中...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      アップロード
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
                <img
                  src={getImageUrl(image.file_path)}
                  alt={image.caption || image.filename}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm truncate">{image.filename}</h3>
                {image.caption && (
                  <p className="text-xs text-muted-foreground">{image.caption}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {new Date(image.created_at).toLocaleDateString('ja-JP')}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm({ id: image.id, filePath: image.file_path })}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {images.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">ギャラリー画像がありません。</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        title="画像を削除"
        description="この画像を削除してもよろしいですか？この操作は取り消せません。"
        confirmText="削除"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </AdminLayout>
  );
}