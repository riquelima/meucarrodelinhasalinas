import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Users, FileText, Megaphone, MessageSquare, Eye, MousePointerClick, Plus, Trash2, Filter, Loader2, Edit } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'passageiro' | 'motorista' | 'anunciante' | 'admin';
  createdAt?: { $date: string } | string;
  updatedAt?: { $date: string } | string;
}

interface UserFilters {
  role: string;
  search: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  category: string;
  views: number;
  image: string;
  image2?: string;
  image3?: string;
  isPublished: boolean;
  link?: string;
  createdAt?: { $date: string } | string;
  updatedAt?: { $date: string } | string;
}

interface BlogFilters {
  status: string;
  search: string;
}

interface Ad {
  _id: string;
  nameCompany: string;
  numberPhone: string;
  description: string;
  image: string;
  category: string;
  views: number;
  isActive: boolean;
  userId: string;
  createdAt?: { $date: string } | string;
  updatedAt?: { $date: string } | string;
}

interface AdFilters {
  status: string;
  category: string;
  search: string;
}

export function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isUserFilterModalOpen, setIsUserFilterModalOpen] = useState(false);
  const [isAdFilterModalOpen, setIsAdFilterModalOpen] = useState(false);
  const [isBlogFilterModalOpen, setIsBlogFilterModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [blogDeleteConfirmOpen, setBlogDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [blogFilters, setBlogFilters] = useState<BlogFilters>({
    status: 'all',
    search: ''
  });
  const [blogLoading, setBlogLoading] = useState(true);
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [adFilters, setAdFilters] = useState<AdFilters>({
    status: 'all',
    category: 'all',
    search: ''
  });
  const [adLoading, setAdLoading] = useState(true);
  const [isAdEditModalOpen, setIsAdEditModalOpen] = useState(false);
  const [adToEdit, setAdToEdit] = useState<Ad | null>(null);
  const [creatingAd, setCreatingAd] = useState(false);
  const [editingAd, setEditingAd] = useState(false);
  const [adFormData, setAdFormData] = useState({
    nameCompany: '',
    numberPhone: '',
    description: '',
    category: 'Alimentação' as string,
    isActive: true
  });
  const [adImage, setAdImage] = useState<File | null>(null);
  const [adImagePreview, setAdImagePreview] = useState<string | null>(null);
  const [adDeleteConfirmOpen, setAdDeleteConfirmOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [isBlogEditModalOpen, setIsBlogEditModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const [creatingBlog, setCreatingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: '',
    authorId: '',
    category: 'tecnologia' as 'tecnologia' | 'financas' | 'seguranca' | 'dicas' | 'sustentabilidade',
    isPublished: true, // Padrão é true (publicado)
    link: ''
  });
  const [blogImages, setBlogImages] = useState<{image?: File, image2?: File, image3?: File}>({});
  const [blogImagePreviews, setBlogImagePreviews] = useState<{image?: string, image2?: string, image3?: string}>({});
  const [removedImages, setRemovedImages] = useState<Set<'image' | 'image2' | 'image3'>>(new Set());
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userFilters, setUserFilters] = useState<UserFilters>({
    role: 'all',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'passageiro' as 'passageiro' | 'motorista' | 'anunciante' | 'admin',
    number: ''
  });

  const formatFullDate = (isoDate: string | { $date: string } | undefined) => {
    if (!isoDate) return "";
    const date = typeof isoDate === 'string' ? new Date(isoDate) : new Date(isoDate.$date);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getUserRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'passageiro': 'Passageiro',
      'motorista': 'Motorista',
      'anunciante': 'Anunciante',
      'admin': 'Administrador'
    };
    return roleMap[role] || role;
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch('http://localhost:3000/users', {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao buscar usuários");
    return await response.json();
  };

  const createUser = async (userData: any) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao criar usuário");
    }
    return await response.json();
  };

  const deleteUser = async (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao deletar usuário");
    return await response.json();
  };

  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch('http://localhost:3000/blogs', {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao buscar blogs");
    return await response.json();
  };

  const createBlog = async (blogData: any, files: {image?: File, image2?: File, image3?: File}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    formData.set('title', blogData.title);
    formData.set('content', blogData.content);
    formData.set('authorId', blogData.authorId);
    formData.set('category', blogData.category);
    formData.set('isPublished', blogData.isPublished.toString());
    if (blogData.link) formData.set('link', blogData.link);

    if (files.image) formData.set('image', files.image);
    if (files.image2) formData.set('image2', files.image2);
    if (files.image3) formData.set('image3', files.image3);

    const response = await fetch('http://localhost:3000/blogs', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao criar blog");
    }
    return await response.json();
  };

  const updateBlog = async (blogId: string, blogData: any, files: {image?: File, image2?: File, image3?: File}, removedImgs?: Set<'image' | 'image2' | 'image3'>) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    if (blogData.title) formData.set('title', blogData.title);
    if (blogData.content) formData.set('content', blogData.content);
    if (blogData.authorId) formData.set('authorId', blogData.authorId);
    if (blogData.category) formData.set('category', blogData.category);
    if (blogData.isPublished !== undefined) formData.set('isPublished', blogData.isPublished.toString());
    if (blogData.link !== undefined && blogData.link !== '' && blogData.link !== 'true') {
      formData.set('link', blogData.link);
    } else if (blogData.link === '') {
      formData.set('link', '');
    }

    if (files.image) formData.set('image', files.image);
    if (files.image2) formData.set('image2', files.image2);
    if (files.image3) formData.set('image3', files.image3);

    if (removedImgs) {
      removedImgs.forEach((imgKey) => {
        formData.set(`remove${imgKey.charAt(0).toUpperCase() + imgKey.slice(1)}`, 'true');
      });
    }

    const response = await fetch(`http://localhost:3000/blogs/${blogId}`, {
      method: 'PUT',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao atualizar blog");
    }
    return await response.json();
  };

  const deleteBlog = async (blogId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`http://localhost:3000/blogs/${blogId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao deletar blog");
    return await response.json();
  };

  const fetchAds = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch('http://localhost:3000/ads', {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao buscar anúncios");
    return await response.json();
  };

  const createAd = async (adData: any, file: File | null, userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    formData.set('nameCompany', adData.nameCompany);
    formData.set('numberPhone', adData.numberPhone);
    formData.set('description', adData.description);
    formData.set('category', adData.category);
    formData.set('isActive', String(adData.isActive === true || adData.isActive === 'active'));
    
    if (file) formData.set('image', file);

    const response = await fetch(`http://localhost:3000/ads/${userId}/anuncios`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao criar anúncio");
    }
    return await response.json();
  };

  const updateAd = async (adId: string, adData: any, file: File | null) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    if (adData.nameCompany) formData.set('nameCompany', adData.nameCompany);
    if (adData.numberPhone) formData.set('numberPhone', adData.numberPhone);
    if (adData.description) formData.set('description', adData.description);
    if (adData.category) formData.set('category', adData.category);
    if (adData.isActive !== undefined) {
      const isActiveValue = adData.isActive === true || adData.isActive === 'active';
      formData.set('isActive', String(isActiveValue));
    }
    
    if (file) formData.set('image', file);

    const response = await fetch(`http://localhost:3000/ads/${adId}`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao atualizar anúncio");
    }
    return await response.json();
  };

  const deleteAd = async (adId: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`http://localhost:3000/ads/${adId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Falha ao deletar anúncio");
    return await response.json();
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setBlogLoading(true);
        const blogsData = await fetchBlogs();
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } catch (error) {
        console.error('Erro ao carregar blogs:', error);
      } finally {
        setBlogLoading(false);
      }
    };

    loadBlogs();
  }, []);

  useEffect(() => {
    const loadAds = async () => {
      try {
        setAdLoading(true);
        const adsData = await fetchAds();
        setAds(adsData);
        setFilteredAds(adsData);
      } catch (error) {
        console.error('Erro ao carregar anúncios:', error);
      } finally {
        setAdLoading(false);
      }
    };

    loadAds();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (userFilters.role !== 'all') {
      filtered = filtered.filter(u => u.role === userFilters.role);
    }

    if (userFilters.search) {
      const searchLower = userFilters.search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchLower) || 
        u.email.toLowerCase().includes(searchLower)
      );
    }

    setFilteredUsers(filtered);
  }, [userFilters, users]);

  useEffect(() => {
    let filtered = [...blogs];

    if (blogFilters.status !== 'all') {
      const isPublished = blogFilters.status === 'published';
      filtered = filtered.filter(b => b.isPublished === isPublished);
    }

    if (blogFilters.search) {
      const searchLower = blogFilters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBlogs(filtered);
  }, [blogFilters, blogs]);

  useEffect(() => {
    let filtered = [...ads];

    if (adFilters.status !== 'all') {
      const isActive = adFilters.status === 'active';
      filtered = filtered.filter(a => a.isActive === isActive);
    }

    if (adFilters.category !== 'all') {
      filtered = filtered.filter(a => a.category === adFilters.category);
    }

    if (adFilters.search) {
      const searchLower = adFilters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.nameCompany.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAds(filtered);
  }, [adFilters, ads]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      await createUser(userFormData);
      setIsUserModalOpen(false);
      toast.success(`Usuário ${userFormData.name} foi cadastrado com sucesso`);
      setUserFormData({ name: '', email: '', password: '', role: 'passageiro', number: '' });
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar usuário');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      // Verifica se o usuário está tentando deletar a própria conta
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode<any>(token);
        const currentUserId = decodedToken.sub;
        if (userToDelete === currentUserId) {
          toast.error('Você não pode excluir sua própria conta');
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
          return;
        }
      }
      
      await deleteUser(userToDelete);
      const usersData = await fetchUsers();
      setUsers(usersData);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      toast.success('Usuário excluído com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar usuário');
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxSize = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleBlogImageChange = async (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image' | 'image2' | 'image3') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido.');
      return;
    }

    const resizedFile = await resizeImage(file);
    setBlogImages({ ...blogImages, [imageKey]: resizedFile });
    setBlogImagePreviews({ ...blogImagePreviews, [imageKey]: URL.createObjectURL(resizedFile) });
  };

  const handleBlogImagesMultipleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: {image?: File, image2?: File, image3?: File} = { ...blogImages };
    const newPreviews: {image?: string, image2?: string, image3?: string} = { ...blogImagePreviews };
    let fileIndex = 0;

    const availableSlots: ('image' | 'image2' | 'image3')[] = [];
    if (!newImages.image && !newPreviews.image) availableSlots.push('image');
    if (!newImages.image2 && !newPreviews.image2) availableSlots.push('image2');
    if (!newImages.image3 && !newPreviews.image3) availableSlots.push('image3');

    for (let i = 0; i < Math.min(files.length, availableSlots.length); i++) {
      const file = files[i];
      const imageKey = availableSlots[fileIndex];

      if (file.size > 2 * 1024 * 1024) {
        toast.error(`A imagem ${i + 1} deve ter no máximo 2MB.`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`A imagem ${i + 1} não é válida.`);
        continue;
      }

      const resizedFile = await resizeImage(file);
      newImages[imageKey] = resizedFile;
      newPreviews[imageKey] = URL.createObjectURL(resizedFile);
      
      if (isBlogEditModalOpen && removedImages.has(imageKey)) {
        const newRemoved = new Set(removedImages);
        newRemoved.delete(imageKey);
        setRemovedImages(newRemoved);
      }
      
      fileIndex++;
    }

    setBlogImages(newImages);
    setBlogImagePreviews(newPreviews);
    
    e.target.value = '';
  };

  const handleRemoveImage = (imageKey: 'image' | 'image2' | 'image3') => {
    const newImages = { ...blogImages };
    const newPreviews = { ...blogImagePreviews };
    delete newImages[imageKey];
    delete newPreviews[imageKey];
    setBlogImages(newImages);
    setBlogImagePreviews(newPreviews);
    
    if (isBlogEditModalOpen && blogToEdit) {
      const newRemoved = new Set(removedImages);
      newRemoved.add(imageKey);
      setRemovedImages(newRemoved);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingBlog(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");
      
      const decodedToken = jwtDecode<any>(token);
      const authorId = decodedToken.sub;

      await createBlog({ ...blogFormData, authorId }, blogImages);
      setIsBlogModalOpen(false);
      toast.success(`Blog "${blogFormData.title}" criado com sucesso`);
      setBlogFormData({ title: '', content: '', authorId: '', category: 'tecnologia', isPublished: true, link: '' });
      setBlogImages({});
      setBlogImagePreviews({});
      const blogsData = await fetchBlogs();
      setBlogs(blogsData);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar blog');
    } finally {
      setCreatingBlog(false);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setBlogToEdit(blog);
    setBlogFormData({
      title: blog.title,
      content: blog.content,
      authorId: blog.authorId,
      category: blog.category as any,
      isPublished: blog.isPublished,
      link: (blog.link && blog.link !== 'true' && blog.link.trim() !== '') ? blog.link : ''
    });
    setBlogImagePreviews({
      image: blog.image || '',
      image2: blog.image2 || '',
      image3: blog.image3 || ''
    });
    setBlogImages({});
    setRemovedImages(new Set());
    setIsBlogEditModalOpen(true);
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogToEdit) return;
    
    setEditingBlog(true);
    try {
      await updateBlog(blogToEdit._id, { ...blogFormData, authorId: blogToEdit.authorId }, blogImages, removedImages);
      setIsBlogEditModalOpen(false);
      setBlogToEdit(null);
      toast.success(`Blog "${blogFormData.title}" atualizado com sucesso`);
      setBlogFormData({ title: '', content: '', authorId: '', category: 'tecnologia', isPublished: true, link: '' });
      setBlogImages({});
      setBlogImagePreviews({});
      setRemovedImages(new Set());
      const blogsData = await fetchBlogs();
      setBlogs(blogsData);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar blog');
    } finally {
      setEditingBlog(false);
    }
  };

  const handleDeleteBlogClick = (blogId: string) => {
    setBlogToDelete(blogId);
    setBlogDeleteConfirmOpen(true);
  };

  const handleDeleteBlogConfirm = async () => {
    if (!blogToDelete) return;
    
    try {
      await deleteBlog(blogToDelete);
      const blogsData = await fetchBlogs();
      setBlogs(blogsData);
      setBlogDeleteConfirmOpen(false);
      setBlogToDelete(null);
      toast.success('Blog excluído com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar blog');
      setBlogDeleteConfirmOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleAdImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido.');
      return;
    }

    const resizedFile = await resizeImage(file);
    setAdImage(resizedFile);
    setAdImagePreview(URL.createObjectURL(resizedFile));
  };

  const handleRemoveAdImage = () => {
    setAdImage(null);
    setAdImagePreview(null);
  };

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('55')) return digits;
    return `55${digits}`;
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAd(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");
      
      const decodedToken = jwtDecode<any>(token);
      const userId = decodedToken.sub;

      const formattedPhone = formatPhoneNumber(adFormData.numberPhone);
      await createAd({ ...adFormData, numberPhone: formattedPhone }, adImage, userId);
      setIsAdModalOpen(false);
      toast.success(`Anúncio "${adFormData.nameCompany}" criado com sucesso`);
      setAdFormData({ nameCompany: '', numberPhone: '', description: '', category: 'Alimentação', isActive: true });
      setAdImage(null);
      setAdImagePreview(null);
      const adsData = await fetchAds();
      setAds(adsData);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar anúncio');
    } finally {
      setCreatingAd(false);
    }
  };

  const handleEditAd = (ad: Ad) => {
    setAdToEdit(ad);
    setAdFormData({
      nameCompany: ad.nameCompany,
      numberPhone: ad.numberPhone,
      description: ad.description,
      category: ad.category,
      isActive: ad.isActive
    });
    setAdImagePreview(ad.image);
    setAdImage(null);
    setIsAdEditModalOpen(true);
  };

  const handleUpdateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adToEdit) return;
    
    setEditingAd(true);
    try {
      const formattedPhone = formatPhoneNumber(adFormData.numberPhone);
      await updateAd(adToEdit._id, { ...adFormData, numberPhone: formattedPhone }, adImage);
      setIsAdEditModalOpen(false);
      setAdToEdit(null);
      toast.success(`Anúncio "${adFormData.nameCompany}" atualizado com sucesso`);
      setAdFormData({ nameCompany: '', numberPhone: '', description: '', category: 'Alimentação', isActive: true });
      setAdImage(null);
      setAdImagePreview(null);
      const adsData = await fetchAds();
      setAds(adsData);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar anúncio');
    } finally {
      setEditingAd(false);
    }
  };

  const handleDeleteAdClick = (adId: string) => {
    setAdToDelete(adId);
    setAdDeleteConfirmOpen(true);
  };

  const handleDeleteAdConfirm = async () => {
    if (!adToDelete) return;
    
    try {
      await deleteAd(adToDelete);
      const adsData = await fetchAds();
      setAds(adsData);
      setAdDeleteConfirmOpen(false);
      setAdToDelete(null);
      toast.success('Anúncio excluído com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar anúncio');
      setAdDeleteConfirmOpen(false);
      setAdToDelete(null);
    }
  };

  const stats = [
    { label: "Total de Usuários", value: users.length.toString(), change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Anúncios Ativos", value: ads.filter(a => a.isActive).length.toString(), change: "+5%", icon: Megaphone, color: "text-purple-400" },
    { label: "Posts no Blog", value: blogs.length.toString(), change: "+3", icon: FileText, color: "text-green-500" },
    { label: "Mensagens Recebidas", value: "87", change: "+18%", icon: MessageSquare, color: "text-orange-500" },
  ];


  const chartData = [
    { name: "Jan", usuarios: 120 },
    { name: "Fev", usuarios: 180 },
    { name: "Mar", usuarios: 250 },
    { name: "Abr", usuarios: 320 },
    { name: "Mai", usuarios: 410 },
    { name: "Jun", usuarios: 520 },
  ];

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h1 className="text-foreground mb-1">Painel Administrativo</h1>
          <p className="text-muted-foreground text-sm">Gerencie usuários, anúncios e conteúdo da plataforma</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-sm bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-muted-foreground text-xs mb-1">{stat.label}</div>
                      <div className="text-foreground text-xl sm:text-2xl mb-1">{stat.value}</div>
                      <div className="text-green-500 text-xs">{stat.change}</div>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart */}
        <Card className="shadow-sm bg-card border-border">
          <CardHeader className="p-4">
            <CardTitle className="text-foreground text-base">Crescimento de Usuários</CardTitle>
            <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} name="Usuários" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full grid grid-cols-3 lg:w-auto bg-muted">
            <TabsTrigger value="users" className="text-xs sm:text-sm">Usuários</TabsTrigger>
            <TabsTrigger value="ads" className="text-xs sm:text-sm">Anúncios</TabsTrigger>
            <TabsTrigger value="blog" className="text-xs sm:text-sm">Blog</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-4 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-foreground text-base lg:text-lg">Gerenciar Usuários</h2>
              <div className="flex gap-2">
                <Dialog open={isUserFilterModalOpen} onOpenChange={setIsUserFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Filtrar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Filtrar Usuários</DialogTitle>
                      <DialogDescription>Defina os critérios para filtrar a lista de usuários</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterUserType">Tipo de Usuário</Label>
                        <Select value={userFilters.role} onValueChange={(value) => setUserFilters({...userFilters, role: value})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="passageiro">Passageiro</SelectItem>
                            <SelectItem value="motorista">Motorista</SelectItem>
                            <SelectItem value="anunciante">Anunciante</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterUserSearch">Buscar por nome ou email</Label>
                        <Input 
                          id="filterUserSearch" 
                          placeholder="Digite para buscar..." 
                          className="bg-input-background"
                          value={userFilters.search}
                          onChange={(e) => setUserFilters({...userFilters, search: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => {
                        setUserFilters({role: 'all', search: ''});
                        setIsUserFilterModalOpen(false);
                      }} className="w-full sm:w-auto">
                        Limpar Filtros
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={() => setIsUserFilterModalOpen(false)}>
                        Aplicar Filtros
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 h-9 text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Criar Novo Usuário</DialogTitle>
                    <DialogDescription>Preencha as informações do novo usuário</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Nome completo</Label>
                        <Input 
                          id="userName" 
                          placeholder="João Silva" 
                          className="bg-input-background"
                          value={userFormData.name}
                          onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">E-mail</Label>
                        <Input 
                          id="userEmail" 
                          type="email" 
                          placeholder="joao@email.com" 
                          className="bg-input-background"
                          value={userFormData.email}
                          onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userNumber">Telefone</Label>
                        <Input 
                          id="userNumber" 
                          type="tel" 
                          placeholder="+55719999999" 
                          className="bg-input-background"
                          value={userFormData.number}
                          onChange={(e) => setUserFormData({...userFormData, number: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userType">Tipo de Usuário</Label>
                        <Select value={userFormData.role} onValueChange={(value: any) => setUserFormData({...userFormData, role: value})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passageiro">Passageiro</SelectItem>
                            <SelectItem value="motorista">Motorista</SelectItem>
                            <SelectItem value="anunciante">Anunciante</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userPassword">Senha</Label>
                        <Input 
                          id="userPassword" 
                          type="password" 
                          className="bg-input-background"
                          value={userFormData.password}
                          onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancelar</Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={creatingUser}>
                        {creatingUser ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Criar Usuário
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* Mobile Cards View */}
                <div className="block lg:hidden space-y-3">
                  {filteredUsers.map((user) => (
                    <Card key={user._id} className="bg-card border-border">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-foreground">{user.name}</div>
                            <div className="text-muted-foreground text-xs mt-1">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{getUserRoleLabel(user.role)}</span>
                          <span>{formatFullDate(user.createdAt)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 h-8 text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                            onClick={() => handleDeleteClick(user._id)}
                            disabled={(() => {
                              const token = localStorage.getItem("token");
                              if (token) {
                                try {
                                  const decodedToken = jwtDecode<any>(token);
                                  return decodedToken.sub === user._id;
                                } catch {
                                  return false;
                                }
                              }
                              return false;
                            })()}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table View */}
                <Card className="shadow-sm hidden lg:block bg-card border-border">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Membro desde</TableHead>
                            <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="text-foreground">{user.name}</TableCell>
                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{getUserRoleLabel(user.role)}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{formatFullDate(user.createdAt)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-600 disabled:opacity-50"
                                onClick={() => handleDeleteClick(user._id)}
                                disabled={(() => {
                                  const token = localStorage.getItem("token");
                                  if (token) {
                                    try {
                                      const decodedToken = jwtDecode<any>(token);
                                      return decodedToken.sub === user._id;
                                    } catch {
                                      return false;
                                    }
                                  }
                                  return false;
                                })()}
                                title={(() => {
                                  const token = localStorage.getItem("token");
                                  if (token) {
                                    try {
                                      const decodedToken = jwtDecode<any>(token);
                                      if (decodedToken.sub === user._id) {
                                        return 'Você não pode excluir sua própria conta';
                                      }
                                    } catch {}
                                  }
                                  return 'Excluir usuário';
                                })()}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads" className="mt-4 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-foreground text-base lg:text-lg">Gerenciar Anúncios</h2>
              <div className="flex gap-2">
                <Dialog open={isAdFilterModalOpen} onOpenChange={setIsAdFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Filtrar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Filtrar Anúncios</DialogTitle>
                      <DialogDescription>Defina os critérios para filtrar a lista de anúncios</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterAdStatus">Status</Label>
                        <Select value={adFilters.status} onValueChange={(value) => setAdFilters({...adFilters, status: value})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="paused">Pausado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterAdCategory">Categoria</Label>
                        <Select value={adFilters.category} onValueChange={(value) => setAdFilters({...adFilters, category: value})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todas as categorias" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="Alimentação">Alimentação</SelectItem>
                            <SelectItem value="Saúde & Bem-estar">Saúde & Bem-estar</SelectItem>
                            <SelectItem value="Educação">Educação</SelectItem>
                            <SelectItem value="Compras">Compras</SelectItem>
                            <SelectItem value="Serviços">Serviços</SelectItem>
                            <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterAdSearch">Buscar por nome ou descrição</Label>
                        <Input 
                          id="filterAdSearch" 
                          placeholder="Digite para buscar..." 
                          className="bg-input-background"
                          value={adFilters.search}
                          onChange={(e) => setAdFilters({...adFilters, search: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => {
                        setAdFilters({status: 'all', category: 'all', search: ''});
                        setIsAdFilterModalOpen(false);
                      }} className="w-full sm:w-auto">
                        Limpar Filtros
                      </Button>
                      <Button className="bg-purple-400 hover:bg-purple-500 w-full sm:w-auto" onClick={() => setIsAdFilterModalOpen(false)}>
                        Aplicar Filtros
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isAdModalOpen} onOpenChange={(open) => {
                  setIsAdModalOpen(open);
                  if (!open) {
                    setAdFormData({ nameCompany: '', numberPhone: '', description: '', category: 'Alimentação', isActive: true });
                    setAdImage(null);
                    setAdImagePreview(null);
                  }
                }}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-400 hover:bg-purple-500 h-9 text-sm" onClick={() => {
                    setAdFormData({ nameCompany: '', numberPhone: '', description: '', category: 'Alimentação', isActive: true });
                    setAdImage(null);
                    setAdImagePreview(null);
                    setAdToEdit(null);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Criar Novo Anúncio</DialogTitle>
                    <DialogDescription>Configure um novo anúncio na plataforma</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateAd}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="adNameCompany">Nome da Empresa *</Label>
                        <Input 
                          id="adNameCompany" 
                          placeholder="Nome do estabelecimento" 
                          className="bg-input-background"
                          value={adFormData.nameCompany}
                          onChange={(e) => setAdFormData({...adFormData, nameCompany: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adNumberPhone">Telefone/WhatsApp *</Label>
                        <Input 
                          id="adNumberPhone" 
                          type="tel" 
                          placeholder="(75) 99955-8190" 
                          className="bg-input-background"
                          value={adFormData.numberPhone}
                          onChange={(e) => setAdFormData({...adFormData, numberPhone: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adCategory">Categoria *</Label>
                        <Select value={adFormData.category} onValueChange={(value) => setAdFormData({...adFormData, category: value})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Alimentação">Alimentação</SelectItem>
                            <SelectItem value="Saúde & Bem-estar">Saúde & Bem-estar</SelectItem>
                            <SelectItem value="Educação">Educação</SelectItem>
                            <SelectItem value="Compras">Compras</SelectItem>
                            <SelectItem value="Serviços">Serviços</SelectItem>
                            <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adDescription">Descrição *</Label>
                        <Textarea 
                          id="adDescription" 
                          placeholder="Descreva o anúncio..." 
                          className="bg-input-background min-h-[100px]"
                          value={adFormData.description}
                          onChange={(e) => setAdFormData({...adFormData, description: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adImage">Imagem do Anúncio *</Label>
                        <Input 
                          id="adImage" 
                          type="file" 
                          accept="image/*" 
                          className="bg-input-background"
                          onChange={handleAdImageChange}
                          required={!adImagePreview}
                        />
                        {adImagePreview && (
                          <div className="relative">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0"
                              onClick={handleRemoveAdImage}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <img src={adImagePreview} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adStatus">Status</Label>
                        <Select value={adFormData.isActive ? 'active' : 'paused'} onValueChange={(value) => setAdFormData({...adFormData, isActive: value === 'active'})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="paused">Pausado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsAdModalOpen(false);
                        setAdFormData({ nameCompany: '', numberPhone: '', description: '', category: 'Alimentação', isActive: true });
                        setAdImage(null);
                        setAdImagePreview(null);
                      }}>Cancelar</Button>
                      <Button type="submit" className="bg-purple-400 hover:bg-purple-500" disabled={creatingAd}>
                        {creatingAd ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Criar Anúncio
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {adLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredAds.map((ad) => (
                  <Card key={ad._id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-foreground truncate">{ad.nameCompany}</h3>
                            {ad.isActive ? (
                              <Badge className="bg-green-600/20 text-green-400 text-xs flex-shrink-0 border-0">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs flex-shrink-0">Pausado</Badge>
                            )}
                          </div>
                          <div className="text-muted-foreground text-xs mb-2">{ad.description}</div>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-blue-500" />
                              <span className="text-muted-foreground">{ad.views?.toLocaleString() || 0} visualizações</span>
                            </div>
                            <div className="text-purple-400">{ad.category}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={() => handleEditAd(ad)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteAdClick(ad._id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="mt-4 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-foreground text-base lg:text-lg">Gerenciar Blog</h2>
              <div className="flex gap-2">
                <Dialog open={isBlogFilterModalOpen} onOpenChange={setIsBlogFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Filtrar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Filtrar Postagens do Blog</DialogTitle>
                      <DialogDescription>Defina os critérios para filtrar as postagens</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterBlogStatus">Status</Label>
                        <Select value={blogFilters.status} onValueChange={(value) => setBlogFilters({...blogFilters, status: value})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                            <SelectItem value="draft">Rascunho</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterBlogSearch">Buscar por título</Label>
                        <Input 
                          id="filterBlogSearch" 
                          placeholder="Digite para buscar..." 
                          className="bg-input-background"
                          value={blogFilters.search}
                          onChange={(e) => setBlogFilters({...blogFilters, search: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => {
                        setBlogFilters({status: 'all', search: ''});
                        setIsBlogFilterModalOpen(false);
                      }} className="w-full sm:w-auto">
                        Limpar Filtros
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={() => setIsBlogFilterModalOpen(false)}>
                        Aplicar Filtros
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isBlogModalOpen} onOpenChange={(open) => {
                  setIsBlogModalOpen(open);
                  if (!open) {
                    setBlogFormData({ title: '', content: '', authorId: '', category: 'tecnologia', isPublished: true, link: '' });
                    setBlogImages({});
                    setBlogImagePreviews({});
                    setRemovedImages(new Set());
                  }
                }}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 h-9 text-sm" onClick={() => {
                    setBlogFormData({ title: '', content: '', authorId: '', category: 'tecnologia', isPublished: true, link: '' });
                    setBlogImages({});
                    setBlogImagePreviews({});
                    setRemovedImages(new Set());
                    setBlogToEdit(null);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Nova Postagem</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Criar Nova Postagem</DialogTitle>
                    <DialogDescription>Escreva um novo artigo para o blog</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateBlog}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="blogTitle">Título</Label>
                        <Input 
                          id="blogTitle" 
                          placeholder="Título do artigo" 
                          className="bg-input-background"
                          value={blogFormData.title}
                          onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blogContent">Conteúdo</Label>
                        <Textarea 
                          id="blogContent" 
                          placeholder="Escreva o conteúdo do artigo..." 
                          className="bg-input-background min-h-[200px]"
                          value={blogFormData.content}
                          onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blogCategory">Categoria</Label>
                        <Select value={blogFormData.category} onValueChange={(value: any) => setBlogFormData({...blogFormData, category: value})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tecnologia">Tecnologia</SelectItem>
                            <SelectItem value="financas">Finanças</SelectItem>
                            <SelectItem value="seguranca">Segurança</SelectItem>
                            <SelectItem value="dicas">Dicas</SelectItem>
                            <SelectItem value="sustentabilidade">Sustentabilidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blogImages">Imagens (selecione até 3 imagens)</Label>
                        <Input 
                          id="blogImages" 
                          type="file" 
                          accept="image/*" 
                          multiple
                          className="bg-input-background"
                          onChange={handleBlogImagesMultipleChange}
                          required={!blogImagePreviews.image}
                        />
                        <p className="text-xs text-muted-foreground">Selecione até 3 imagens de uma vez</p>
                      </div>
                      {blogImagePreviews.image && (
                        <div className="space-y-2">
                          <div className="relative">
                            <Label>Imagem 1</Label>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0"
                              onClick={() => handleRemoveImage('image')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <img src={blogImagePreviews.image} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                          </div>
                        </div>
                      )}
                      {blogImagePreviews.image2 && (
                        <div className="space-y-2">
                          <div className="relative">
                            <Label>Imagem 2</Label>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0"
                              onClick={() => handleRemoveImage('image2')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <img src={blogImagePreviews.image2} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                          </div>
                        </div>
                      )}
                      {blogImagePreviews.image3 && (
                        <div className="space-y-2">
                          <div className="relative">
                            <Label>Imagem 3</Label>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0"
                              onClick={() => handleRemoveImage('image3')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <img src={blogImagePreviews.image3} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="blogLink">Link (opcional)</Label>
                        <Input 
                          id="blogLink" 
                          placeholder="https://..." 
                          className="bg-input-background"
                          value={blogFormData.link}
                          onChange={(e) => setBlogFormData({...blogFormData, link: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blogStatus">Status</Label>
                        <Select value={blogFormData.isPublished ? 'published' : 'draft'} onValueChange={(value) => setBlogFormData({...blogFormData, isPublished: value === 'published'})}>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Rascunho</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsBlogModalOpen(false);
                        setBlogFormData({ title: '', content: '', authorId: '', category: 'tecnologia', isPublished: true, link: '' });
                        setBlogImages({});
                        setBlogImagePreviews({});
                      }}>Cancelar</Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={creatingBlog}>
                        {creatingBlog ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Criar Postagem
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {blogLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredBlogs.map((post) => (
                  <Card key={post._id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-foreground truncate">{post.title}</h3>
                            {post.isPublished ? (
                              <Badge className="bg-green-600/20 text-green-400 text-xs flex-shrink-0 border-0">Publicado</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs flex-shrink-0">Rascunho</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>{formatFullDate(post.createdAt)}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{post.views} visualizações</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={() => handleEditBlog(post)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteBlogClick(post._id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteConfirmOpen(false);
                setUserToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              onClick={handleDeleteConfirm}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blogDeleteConfirmOpen} onOpenChange={setBlogDeleteConfirmOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setBlogDeleteConfirmOpen(false);
                setBlogToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              onClick={handleDeleteBlogConfirm}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adDeleteConfirmOpen} onOpenChange={setAdDeleteConfirmOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setAdDeleteConfirmOpen(false);
                setAdToDelete(null);
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              onClick={handleDeleteAdConfirm}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdEditModalOpen} onOpenChange={setIsAdEditModalOpen}>
        <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Anúncio</DialogTitle>
            <DialogDescription>Edite as informações do anúncio</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAd}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editAdNameCompany">Nome da Empresa *</Label>
                <Input 
                  id="editAdNameCompany" 
                  placeholder="Nome do estabelecimento" 
                  className="bg-input-background"
                  value={adFormData.nameCompany}
                  onChange={(e) => setAdFormData({...adFormData, nameCompany: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAdNumberPhone">Telefone/WhatsApp *</Label>
                <Input 
                  id="editAdNumberPhone" 
                  type="tel" 
                  placeholder="(75) 99955-8190" 
                  className="bg-input-background"
                  value={adFormData.numberPhone}
                  onChange={(e) => setAdFormData({...adFormData, numberPhone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAdCategory">Categoria *</Label>
                <Select value={adFormData.category} onValueChange={(value) => setAdFormData({...adFormData, category: value})}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                    <SelectItem value="Saúde & Bem-estar">Saúde & Bem-estar</SelectItem>
                    <SelectItem value="Educação">Educação</SelectItem>
                    <SelectItem value="Compras">Compras</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAdDescription">Descrição *</Label>
                <Textarea 
                  id="editAdDescription" 
                  placeholder="Descreva o anúncio..." 
                  className="bg-input-background min-h-[100px]"
                  value={adFormData.description}
                  onChange={(e) => setAdFormData({...adFormData, description: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAdImage">Imagem do Anúncio</Label>
                <Input 
                  id="editAdImage" 
                  type="file" 
                  accept="image/*" 
                  className="bg-input-background"
                  onChange={handleAdImageChange}
                />
                {adImagePreview && (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={handleRemoveAdImage}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <img src={adImagePreview} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAdStatus">Status</Label>
                <Select value={adFormData.isActive ? 'active' : 'paused'} onValueChange={(value) => setAdFormData({...adFormData, isActive: value === 'active'})}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsAdEditModalOpen(false);
                setAdToEdit(null);
                setAdFormData({ nameCompany: '', numberPhone: '', description: '', category: 'Alimentação', isActive: true });
                setAdImage(null);
                setAdImagePreview(null);
              }}>Cancelar</Button>
              <Button type="submit" className="bg-purple-400 hover:bg-purple-500" disabled={editingAd}>
                {editingAd ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isBlogEditModalOpen} onOpenChange={setIsBlogEditModalOpen}>
        <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Postagem</DialogTitle>
            <DialogDescription>Edite as informações da postagem</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateBlog}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editBlogTitle">Título</Label>
                <Input 
                  id="editBlogTitle" 
                  placeholder="Título do artigo" 
                  className="bg-input-background"
                  value={blogFormData.title}
                  onChange={(e) => setBlogFormData({...blogFormData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBlogContent">Conteúdo</Label>
                <Textarea 
                  id="editBlogContent" 
                  placeholder="Escreva o conteúdo do artigo..." 
                  className="bg-input-background min-h-[200px]"
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({...blogFormData, content: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBlogCategory">Categoria</Label>
                <Select value={blogFormData.category} onValueChange={(value: any) => setBlogFormData({...blogFormData, category: value})}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="financas">Finanças</SelectItem>
                    <SelectItem value="seguranca">Segurança</SelectItem>
                    <SelectItem value="dicas">Dicas</SelectItem>
                    <SelectItem value="sustentabilidade">Sustentabilidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBlogImages">Imagens (selecione até 3 imagens para substituir)</Label>
                <Input 
                  id="editBlogImages" 
                  type="file" 
                  accept="image/*" 
                  multiple
                  className="bg-input-background"
                  onChange={handleBlogImagesMultipleChange}
                />
                <p className="text-xs text-muted-foreground">Selecione até 3 imagens de uma vez para substituir</p>
              </div>
              {blogImagePreviews.image && (
                <div className="space-y-2">
                  <div className="relative">
                    <Label>Imagem 1</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => handleRemoveImage('image')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <img src={blogImagePreviews.image} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                  </div>
                </div>
              )}
              {blogImagePreviews.image2 && (
                <div className="space-y-2">
                  <div className="relative">
                    <Label>Imagem 2</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => handleRemoveImage('image2')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <img src={blogImagePreviews.image2} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                  </div>
                </div>
              )}
              {blogImagePreviews.image3 && (
                <div className="space-y-2">
                  <div className="relative">
                    <Label>Imagem 3</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => handleRemoveImage('image3')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <img src={blogImagePreviews.image3} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="editBlogLink">Link (opcional)</Label>
                <Input 
                  id="editBlogLink" 
                  placeholder="https://..." 
                  className="bg-input-background"
                  value={blogFormData.link}
                  onChange={(e) => setBlogFormData({...blogFormData, link: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBlogStatus">Status</Label>
                <Select value={blogFormData.isPublished ? 'published' : 'draft'} onValueChange={(value) => setBlogFormData({...blogFormData, isPublished: value === 'published'})}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsBlogEditModalOpen(false);
                setBlogToEdit(null);
                setBlogFormData({ title: '', content: '', authorId: '', category: 'tecnologia', isPublished: true, link: '' });
                setBlogImages({});
                setBlogImagePreviews({});
                setRemovedImages(new Set());
              }}>Cancelar</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={editingBlog}>
                {editingBlog ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}
