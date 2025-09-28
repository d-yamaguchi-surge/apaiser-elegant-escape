import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GalleryImage {
  id: string;
  filename: string;
  caption?: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  updated_at: string;
}

export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: 'エラー',
        description: 'ギャラリー画像の取得に失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, caption?: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{
          filename: file.name,
          caption: caption || null,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        }]);

      if (dbError) throw dbError;

      await fetchImages();
      toast({
        title: '成功',
        description: '画像をアップロードしました。',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'エラー',
        description: '画像のアップロードに失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const deleteImage = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      await fetchImages();
      toast({
        title: '成功',
        description: '画像を削除しました。',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'エラー',
        description: '画像の削除に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    uploadImage,
    deleteImage,
    getImageUrl,
    refetch: fetchImages,
  };
};