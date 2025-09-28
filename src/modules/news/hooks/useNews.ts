import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  published_date: string;
  created_at: string;
  updated_at: string;
}

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'エラー',
        description: 'お知らせの取得に失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('news')
        .insert([newsData]);

      if (error) throw error;
      
      await fetchNews();
      toast({
        title: '成功',
        description: 'お知らせを作成しました。',
      });
    } catch (error) {
      console.error('Error creating news:', error);
      toast({
        title: 'エラー',
        description: 'お知らせの作成に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const updateNews = async (id: string, newsData: Partial<NewsItem>) => {
    try {
      const { error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchNews();
      toast({
        title: '成功',
        description: 'お知らせを更新しました。',
      });
    } catch (error) {
      console.error('Error updating news:', error);
      toast({
        title: 'エラー',
        description: 'お知らせの更新に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchNews();
      toast({
        title: '成功',
        description: 'お知らせを削除しました。',
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: 'エラー',
        description: 'お知らせの削除に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    createNews,
    updateNews,
    deleteNews,
    refetch: fetchNews,
  };
};