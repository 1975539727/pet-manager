'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Search, Image as ImageIcon, Sparkles, RefreshCw, MoreVertical, CheckCircle, Clock, X, Download, Trash2 } from 'lucide-react';

// ============================================
// 预设模板数据
// ============================================
const PRESET_TEMPLATES = [
  { id: 'candy-macaron', name: '糖果马卡龙', description: '高饱和马卡龙糖果色，活泼甜美，非常适合小型犬和猫咪。' },
  { id: 'q-cute-bubble', name: 'Q版软萌泡泡', description: '超软萌Q版卡通风，圆脸、大眼、粉嫩渐变，适合所有宠物。' },
  { id: 'future-blue', name: '未来蓝光', description: '蓝紫色霓虹科技风，酷帅型宠物特别适合' },
  { id: 'healing-cream', name: '治愈奶油白', description: '绿色系童话森林元素，光斑与薄雾营造奇幻氛围' },
  { id: 'luxury-black-gold', name: '轻奢黑金质感', description: '冷静高级感风格，适合帅气类宠物（英短、美短、边牧、黑色狗狗等）' },
  { id: 'dream-heart', name: '梦幻爱心', description: '粉色梦幻泡泡与爱心元素，强调可爱与治愈感' },
  { id: 'comic-flash', name: '漫画闪耀', description: '炫彩漫画赛博风格，突出线条感与星光粒子特效' },
  { id: 'japanese-bubble', name: '日系元气泡泡', description: '明亮日系元气动画风，偏高饱和、轻手绘质感' },
  { id: 'sketch-pet', name: '素描手绘宠物', description: '手绘素描线条风格，黑白灰色调，艺术感强，适合头像使用。' },
  { id: 'birthday-balloon', name: '生日派对气球', description: '生日气球、蛋糕、彩纸，适合做宠物生日贴纸。' },
  { id: 'valentine-pink', name: '情人节粉色心愿', description: '粉色浪漫，心形元素拉满，适合少女心用户。' },
  { id: 'halloween-pumpkin', name: '万圣节南瓜夜', description: '可爱版"小万圣节恐怖"，一点点spooky但完全不吓人。' },
  { id: 'spring-festival', name: '春节红包福气', description: '国风红金，新年福气满满。' },
  { id: 'christmas-cute', name: '圣诞暖暖小可爱', description: '浓郁节日气氛，融合圣诞帽、雪花、彩灯等温暖元素。' },
  { id: 'q-line-art', name: 'Q版简笔线条', description: '极简卡通线条风格，干净背景，非常适合头像用途。' },
  { id: 'hand-painted-q', name: '手绘厚涂Q版', description: '轻手绘 + 厚涂质感，突出艺术感但仍保留Q版可爱要素。' },
];

// ============================================
// 生成记录类型（对应数据库 sticker_records 表）
// ============================================
interface StickerRecord {
  id: string;
  user_id?: string;
  template_id?: string;
  template_name: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  created_at?: string;
  image_url?: string;
  prompt?: string;
  task_id?: string;
}

// ============================================
// 样式组件（neo-brutalist 风格）
// ============================================

const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 96px;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  font-family: var(--font-dm-sans), sans-serif;
  padding-bottom: 3rem;
`;

const Header = styled.div`
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  position: sticky;
  top: 96px;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;


const ContentContainer = styled.div`
  max-width: 40rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
`;

const SectionLabel = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #2C2420;
  margin-bottom: 1rem;
  font-family: var(--font-playfair), serif;
`;

// 预设模板选择
const TemplateSelector = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const TemplateTrigger = styled.button<{ $hasValue?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.$hasValue ? '#2C2420' : '#8B7E74'};
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.3s;
  text-align: left;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px #2C2420;
  }

  svg {
    color: #782221;
    flex-shrink: 0;
  }
`;

const TemplateDropdown = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  z-index: 20;
  max-height: 300px;
  overflow-y: auto;
  display: ${props => props.$show ? 'block' : 'none'};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #2C2420;
  }
`;

const TemplateSearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid rgba(44, 36, 32, 0.15);

  input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    color: #2C2420;
    outline: none;
    font-family: var(--font-dm-sans), sans-serif;

    &::placeholder {
      color: #8B7E74;
    }
  }

  svg {
    color: #782221;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`;

const TemplateOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.$selected ? 'rgba(120, 34, 33, 0.08)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-family: var(--font-dm-sans), sans-serif;

  &:hover {
    background: rgba(120, 34, 33, 0.1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(44, 36, 32, 0.08);
  }

  .template-icon {
    font-size: 1.25rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(197, 160, 89, 0.15);
    border: 1px solid rgba(44, 36, 32, 0.15);
    flex-shrink: 0;
  }

  .template-info {
    flex: 1;
    min-width: 0;

    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #2C2420;
    }

    .desc {
      font-size: 0.75rem;
      color: #5D4037;
      margin-top: 0.125rem;
    }
  }
`;

// 自定义提示词
const PromptTextarea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  padding: 0.875rem 1rem;
  background: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  font-size: 0.9rem;
  color: #2C2420;
  resize: vertical;
  font-family: var(--font-dm-sans), sans-serif;
  margin-bottom: 1rem;
  transition: all 0.3s;
  outline: none;

  &::placeholder {
    color: #8B7E74;
  }

  &:focus {
    border-color: #782221;
    box-shadow: 4px 4px 0px 0px #782221;
  }
`;

// 相册 / 拍照按钮行
const MediaButtonRow = styled.div`
  margin-bottom: 1rem;
`;

const MediaButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.3s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px 0px #2C2420;
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: 1px 1px 0px 0px #2C2420;
  }

  svg {
    color: #782221;
    width: 18px;
    height: 18px;
  }
`;

// 已选图片预览
const ImagePreviewContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border: 2px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  overflow: hidden;

  img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    display: block;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background: #782221;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #9B2C2C;
  }
`;


// 生成按钮
const GenerateButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.$disabled ? '#8B7E74' : 'linear-gradient(135deg, #782221, #9B2C2C)'};
  color: #F5F2E9;
  border: 3px solid #2C2420;
  box-shadow: 5px 5px 0px 0px #2C2420;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-family: var(--font-dm-sans), sans-serif;
  letter-spacing: 0.05em;
  transition: all 0.3s;
  margin-bottom: 2.5rem;

  &:hover {
    ${props => !props.$disabled && `
      transform: translate(-2px, -2px);
      box-shadow: 7px 7px 0px 0px #2C2420;
    `}
  }

  &:active {
    ${props => !props.$disabled && `
      transform: translate(0, 0);
      box-shadow: 2px 2px 0px 0px #2C2420;
    `}
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// 生成记录区域
const HistorySection = styled.div`
  margin-top: 1rem;
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 {
    font-size: 1rem;
    font-weight: 700;
    color: #2C2420;
    font-family: var(--font-playfair), serif;
  }
`;

const RefreshButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const RecordCard = styled.div`
  background: #F5F2E9;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  margin-bottom: 1.25rem;
  transition: all 0.3s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px 0px #2C2420;
  }
`;

const RecordHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
  font-family: var(--font-dm-sans), sans-serif;

  ${props => {
    switch (props.$status) {
      case 'completed':
        return `
          background: #556B2F;
          color: #F5F2E9;
        `;
      case 'generating':
        return `
          background: #C5A059;
          color: #2C2420;
        `;
      case 'failed':
        return `
          background: #782221;
          color: #F5F2E9;
        `;
      default:
        return `
          background: rgba(255,255,255,0.5);
          color: #5D4037;
        `;
    }
  }}

  svg {
    width: 12px;
    height: 12px;
  }
`;

const RecordDate = styled.span`
  font-size: 0.75rem;
  color: #782221;
  font-weight: 600;
  font-family: var(--font-cinzel), serif;
`;

const RecordMoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #5D4037;
  padding: 0.25rem;
  display: flex;
  align-items: center;

  &:hover {
    color: #782221;
  }
`;

const RecordBody = styled.div`
  padding: 0.875rem 1rem;
`;

const RecordTemplateName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2C2420;
  margin-bottom: 0.75rem;

  .icon {
    font-size: 1.125rem;
  }
`;

const RecordImage = styled.div`
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(197, 160, 89, 0.1), rgba(120, 34, 33, 0.05));
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    display: block;
    object-fit: cover;
  }

  .placeholder {
    color: #8B7E74;
    font-size: 0.8rem;
    text-align: center;
    padding: 2rem;
  }
`;

const DownloadButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  background: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.3s;

  &:hover {
    background: #556B2F;
    color: #F5F2E9;
    border-color: #2C2420;
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px 0px #2C2420;
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: 1px 1px 0px 0px #2C2420;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const RecordMenuWrapper = styled.div`
  position: relative;
`;

const RecordDropdownMenu = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  z-index: 30;
  min-width: 120px;
`;

const RecordMenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.$danger ? '#782221' : '#2C2420'};
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$danger ? 'rgba(120, 34, 33, 0.1)' : 'rgba(44, 36, 32, 0.06)'};
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(44, 36, 32, 0.1);
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 36, 32, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmModal = styled.div`
  background: #F5F2E9;
  border: 3px solid #2C2420;
  box-shadow: 8px 8px 0px 0px #2C2420;
  padding: 2rem;
  max-width: 320px;
  width: 90%;
  text-align: center;

  .title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2C2420;
    font-family: var(--font-playfair), serif;
    margin-bottom: 0.5rem;
  }

  .desc {
    font-size: 0.85rem;
    color: #5D4037;
    margin-bottom: 1.5rem;
  }
`;

const ConfirmButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ConfirmBtn = styled.button<{ $danger?: boolean }>`
  flex: 1;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
  cursor: pointer;
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.2s;
  background: ${props => props.$danger ? '#782221' : '#F5F2E9'};
  color: ${props => props.$danger ? '#F5F2E9' : '#2C2420'};

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px 0px #2C2420;
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: 1px 1px 0px 0px #2C2420;
  }
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  border: 2px dashed rgba(44, 36, 32, 0.2);

  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .text {
    font-size: 0.875rem;
    color: #8B7E74;
  }
`;

const GeneratingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 36, 32, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const GeneratingModal = styled.div`
  background: #F5F2E9;
  border: 3px solid #2C2420;
  box-shadow: 8px 8px 0px 0px #2C2420;
  padding: 2.5rem;
  text-align: center;
  max-width: 320px;
  width: 90%;

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(44, 36, 32, 0.15);
    border-top-color: #782221;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.25rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2C2420;
    font-family: var(--font-playfair), serif;
    margin-bottom: 0.5rem;
  }

  .desc {
    font-size: 0.8rem;
    color: #5D4037;
  }
`;

// ============================================
// 页面组件
// ============================================

export default function PetStickerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 状态
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PRESET_TEMPLATES[0] | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 生成记录
  const [records, setRecords] = useState<StickerRecord[]>([]);

  // 下拉菜单 & 删除确认
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 获取用户ID
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.id);
    }
  }, []);

  // 从数据库加载生成记录
  const loadRecords = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/sticker/records?user_id=${userId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setRecords(data.data);
      }
    } catch (err) {
    }
  }, [userId]);

  // userId 变化时加载记录
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // 过滤模板
  const filteredTemplates = PRESET_TEMPLATES.filter(t =>
    t.name.includes(templateSearch) || t.description.includes(templateSearch)
  );

  // 点击外部关闭下拉
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowTemplateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 选择图片
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 移除图片
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 更新数据库记录状态
  const updateRecordInDB = useCallback(async (id: string, status: string, image_url?: string) => {
    try {
      await fetch('/api/sticker/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, image_url }),
      });
    } catch (err) {
    }
  }, []);

  // 轮询任务状态
  const pollTaskStatus = useCallback((taskId: string, recordId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/sticker/status?task_id=${taskId}`);
        const data = await res.json();

        if (data.task_status === 'SUCCEEDED') {
          clearInterval(interval);
          const imageUrl = data.results?.[0]?.url || '';
          setRecords(prev =>
            prev.map(r =>
              r.id === recordId ? { ...r, status: 'completed', image_url: imageUrl } : r
            )
          );
          await updateRecordInDB(recordId, 'completed', imageUrl);
        } else if (data.task_status === 'FAILED') {
          clearInterval(interval);
          setRecords(prev =>
            prev.map(r =>
              r.id === recordId ? { ...r, status: 'failed' } : r
            )
          );
          await updateRecordInDB(recordId, 'failed');
        }
        // PENDING / RUNNING 继续轮询
      } catch {
        clearInterval(interval);
        setRecords(prev =>
          prev.map(r =>
            r.id === recordId ? { ...r, status: 'failed' } : r
          )
        );
        await updateRecordInDB(recordId, 'failed');
      }
    }, 3000);
  }, [updateRecordInDB]);

  // 保存记录到数据库
  const saveRecordToDB = useCallback(async (record: Omit<StickerRecord, 'id'> & { id?: string }) => {
    try {
      const res = await fetch('/api/sticker/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: record.user_id,
          template_id: record.template_id,
          template_name: record.template_name,
          prompt: record.prompt,
          status: record.status,
          image_url: record.image_url,
          task_id: record.task_id,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data as StickerRecord;
      }
    } catch (err) {
    }
    return null;
  }, []);

  // 生成贴纸
  const handleGenerate = async () => {
    if (!userId) return;
    if (!selectedTemplate && !customPrompt.trim()) return;
    if (!selectedImage) return;

    setIsGenerating(true);
    const templateName = selectedTemplate?.name || '自定义贴纸';
    const templateId = selectedTemplate?.id || 'custom';
    const parts: string[] = [];
    if (selectedTemplate) parts.push(selectedTemplate.description);
    if (customPrompt.trim()) parts.push(customPrompt.trim());
    const text = parts.join('；');

    try {
      const body: Record<string, string> = { text };
      if (selectedImage) {
        body.imageBase64 = selectedImage;
      }

      const res = await fetch('/api/sticker/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || JSON.stringify(data) || '生成失败');
      }

      if (data.status === 'SUCCEEDED' && data.imageUrl) {
        // 同步模式：直接拿到生成结果
        const saved = await saveRecordToDB({
          user_id: userId,
          template_id: templateId,
          template_name: templateName,
          prompt: text,
          status: 'completed',
          image_url: data.imageUrl,
        });
        if (saved) {
          setRecords(prev => [saved, ...prev]);
        }
        setIsGenerating(false);
      } else if (data.task_id) {
        // 异步模式：先保存 generating 状态到数据库，再轮询
        const saved = await saveRecordToDB({
          user_id: userId,
          template_id: templateId,
          template_name: templateName,
          prompt: text,
          status: 'generating',
          task_id: data.task_id,
        });
        if (saved) {
          setRecords(prev => [saved, ...prev]);
          pollTaskStatus(data.task_id, saved.id);
        }
        setIsGenerating(false);
      } else {
        throw new Error('未知的响应格式');
      }
    } catch (err: unknown) {
      setIsGenerating(false);
      const errorMsg = err instanceof Error ? err.message : '未知错误';
      alert('生成失败: ' + errorMsg);
    }
  };

  // 格式化时间
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) +
      ' ' +
      d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // 下载图片
  const handleDownload = async (imageUrl: string, templateName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${templateName}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // fallback: 直接打开新窗口
      window.open(imageUrl, '_blank');
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'generating': return '生成中';
      case 'failed': return '失败';
      default: return '等待中';
    }
  };

  // 点击外部关闭记录菜单
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutsideMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, []);

  // 删除记录
  const handleDeleteRecord = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sticker/records?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRecords(prev => prev.filter(r => r.id !== id));
      } else {
        alert('删除失败: ' + (data.message || '未知错误'));
      }
    } catch (err) {
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <PageContainer>
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageSelect}
      />

      {/* 头部 */}
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </BackButton>
          <Title>萌宠贴纸工坊</Title>
        </HeaderLeft>
      </Header>

      <ContentContainer>
        {/* 创作方式 */}
        <SectionLabel>创作方式</SectionLabel>

        {/* 预设模板选择 */}
        <TemplateSelector ref={dropdownRef}>
          <TemplateTrigger
            $hasValue={!!selectedTemplate}
            onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
          >
            <Search size={18} />
            {selectedTemplate ? (
              <span>{selectedTemplate.name}</span>
            ) : (
              <span>选择预设模板</span>
            )}
          </TemplateTrigger>

          <TemplateDropdown $show={showTemplateDropdown}>
            <TemplateSearchInput>
              <Search />
              <input
                placeholder="搜索模板..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </TemplateSearchInput>
            {filteredTemplates.map(template => (
              <TemplateOption
                key={template.id}
                $selected={selectedTemplate?.id === template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowTemplateDropdown(false);
                  setTemplateSearch('');
                }}
              >
                <div className="template-info">
                  <div className="name">{template.name}</div>
                  <div className="desc">{template.description}</div>
                </div>
              </TemplateOption>
            ))}
            {filteredTemplates.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#8B7E74', fontSize: '0.85rem' }}>
                未找到匹配的模板
              </div>
            )}
          </TemplateDropdown>
        </TemplateSelector>

        {/* 自定义提示词 */}
        <PromptTextarea
          placeholder="自定义提示词 (可选)"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={3}
        />

        {/* 已选图片预览 */}
        {selectedImage && (
          <ImagePreviewContainer>
            <img src={selectedImage} alt="已选图片" />
            <RemoveImageButton onClick={handleRemoveImage}>
              <X size={14} />
            </RemoveImageButton>
          </ImagePreviewContainer>
        )}

        {/* 相册 / 拍照 */}
        <MediaButtonRow>
          <MediaButton onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={18} />
            相册
          </MediaButton>
        </MediaButtonRow>

        {/* 生成按钮 */}
        <GenerateButton
          $disabled={isGenerating || (!selectedTemplate && !customPrompt.trim()) || !selectedImage}
          onClick={handleGenerate}
          disabled={isGenerating || (!selectedTemplate && !customPrompt.trim()) || !selectedImage}
        >
          <Sparkles size={20} />
          生成萌宠贴纸
        </GenerateButton>

        {/* 生成记录 */}
        <HistorySection>
          <HistoryHeader>
            <h2>生成记录</h2>
            <RefreshButton onClick={loadRecords}>
              <RefreshCw />
            </RefreshButton>
          </HistoryHeader>

          {records.length === 0 ? (
            <EmptyHistory>
              <div className="icon">🎨</div>
              <div className="text">暂无生成记录，快去创作吧！</div>
            </EmptyHistory>
          ) : (
            records.map(record => (
              <RecordCard key={record.id}>
                <RecordHeader>
                  <StatusBadge $status={record.status}>
                    {record.status === 'completed' && <CheckCircle size={12} />}
                    {record.status === 'generating' && <Clock size={12} />}
                    {formatStatus(record.status)}
                  </StatusBadge>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <RecordDate>{formatDate(record.created_at)}</RecordDate>
                    <RecordMenuWrapper ref={openMenuId === record.id ? menuRef : undefined}>
                      <RecordMoreButton onClick={() => setOpenMenuId(openMenuId === record.id ? null : record.id)}>
                        <MoreVertical size={16} />
                      </RecordMoreButton>
                      <RecordDropdownMenu $show={openMenuId === record.id}>
                        <RecordMenuItem $danger onClick={() => { setOpenMenuId(null); setDeleteConfirmId(record.id); }}>
                          <Trash2 size={15} /> 删除
                        </RecordMenuItem>
                      </RecordDropdownMenu>
                    </RecordMenuWrapper>
                  </div>
                </RecordHeader>
                <RecordBody>
                  <RecordTemplateName>
                    {record.template_name}
                  </RecordTemplateName>
                  <RecordImage>
                    {record.image_url ? (
                      <img src={record.image_url} alt={record.template_name} />
                    ) : (
                      <div className="placeholder">
                        贴纸预览区域<br />
                        （接入 AI 生成后将显示结果图片）
                      </div>
                    )}
                  </RecordImage>
                  {record.status === 'completed' && record.image_url && (
                    <DownloadButton onClick={() => handleDownload(record.image_url!, record.template_name)}>
                      <Download size={16} />
                      下载图片
                    </DownloadButton>
                  )}
                </RecordBody>
              </RecordCard>
            ))
          )}
        </HistorySection>
      </ContentContainer>

      {/* 生成中弹窗 */}
      {isGenerating && (
        <GeneratingOverlay>
          <GeneratingModal>
            <div className="spinner" />
            <div className="title">正在生成贴纸...</div>
            <div className="desc">AI 正在为你的萌宠创作，请稍候</div>
          </GeneratingModal>
        </GeneratingOverlay>
      )}

      {/* 删除确认弹窗 */}
      {deleteConfirmId && (
        <ConfirmOverlay onClick={() => !isDeleting && setDeleteConfirmId(null)}>
          <ConfirmModal onClick={(e) => e.stopPropagation()}>
            <div className="title">确认删除</div>
            <div className="desc">删除后无法恢复，确定要删除这条记录吗？</div>
            <ConfirmButtonRow>
              <ConfirmBtn onClick={() => setDeleteConfirmId(null)} disabled={isDeleting}>取消</ConfirmBtn>
              <ConfirmBtn $danger onClick={() => handleDeleteRecord(deleteConfirmId)} disabled={isDeleting}>
                {isDeleting ? '删除中...' : '删除'}
              </ConfirmBtn>
            </ConfirmButtonRow>
          </ConfirmModal>
        </ConfirmOverlay>
      )}
    </PageContainer>
  );
}
