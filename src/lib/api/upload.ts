import { supabase } from '@/lib/supabase';

/**
 * 上传图片到 Supabase Storage
 * @param file 图片文件
 * @param bucket 存储桶名称（默认为 'pet-avatars'）
 * @param folder 文件夹路径（可选）
 * @returns 上传成功返回公共URL，失败返回null
 */
export async function uploadImage(
  file: File,
  bucket: string = 'pet-avatars',
  folder?: string
): Promise<string | null> {
  try {
    // 生成唯一文件名
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // 上传文件
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('上传图片失败:', error);
      return null;
    }

    // 获取公共URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('上传图片异常:', error);
    return null;
  }
}

/**
 * 删除 Supabase Storage 中的图片
 * @param url 图片URL
 * @param bucket 存储桶名称
 * @returns 删除成功返回true，失败返回false
 */
export async function deleteImage(
  url: string,
  bucket: string = 'pet-avatars'
): Promise<boolean> {
  try {
    // 从URL中提取文件路径
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('删除图片失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('删除图片异常:', error);
    return false;
  }
}

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @param quality 压缩质量 (0-1)
 * @returns 压缩后的文件
 */
export function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 计算新尺寸
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
  });
}

/**
 * 验证图片文件
 * @param file 文件
 * @param maxSize 最大文件大小（字节）
 * @returns 验证通过返回true，否则返回错误信息
 */
export function validateImageFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024 // 默认5MB
): { valid: boolean; error?: string } {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: '不支持的文件格式，请上传 JPG、PNG、GIF 或 WebP 格式的图片'
    };
  }
  
  // 检查文件大小
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `文件大小不能超过 ${maxSizeMB}MB`
    };
  }
  
  return { valid: true };
}

/**
 * 将图片文件转换为Base64编码（简单方案，无需配置Storage）
 * @param file 图片文件
 * @returns Base64编码的图片字符串
 */
export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      resolve(base64String);
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsDataURL(file);
  });
}
