import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Course {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_path: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async (includeInactive = false) => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('courses')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('コース情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const addCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase.from('courses').insert([courseData]);

      if (error) throw error;
      toast.success('コースを追加しました');
      await fetchCourses(true);
    } catch (error: any) {
      console.error('Error adding course:', error);
      toast.error('コースの追加に失敗しました');
      throw error;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id);

      if (error) throw error;
      toast.success('コースを更新しました');
      await fetchCourses(true);
    } catch (error: any) {
      console.error('Error updating course:', error);
      toast.error('コースの更新に失敗しました');
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);

      if (error) throw error;
      toast.success('コースを削除しました');
      await fetchCourses(true);
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast.error('コースの削除に失敗しました');
      throw error;
    }
  };

  const uploadCourseImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `courses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('画像のアップロードに失敗しました');
      return null;
    }
  };

  useEffect(() => {
    fetchCourses(true);
  }, []);

  return {
    courses,
    isLoading,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    uploadCourseImage,
  };
};
