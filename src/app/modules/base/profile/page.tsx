"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin, Bell, Shield, Edit, Camera, Upload, Loader2 } from "lucide-react"
import api, { getAvatarUrl } from "@/lib/api"

import { supabase } from "@/lib/supabaseConfig"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userInfo, setUserInfo] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    role: "",
    location: "",
    bio: "",
    avatar: ""
  })
  // Guarda o estado original para permitir o cancelamento das edições
  const [originalUserInfo, setOriginalUserInfo] = useState(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await api.get("/me")
        const data = await response.data

        const userData = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          role : data.role || "doador",
          location: data.location || "",
          bio: data.bio || "",
          avatar: getAvatarUrl(data.avatar) || "/default-avatar.png"
        }

        setUserInfo(userData)
        setOriginalUserInfo(userData) // Salva o estado inicial
        console.log(userData.avatar)
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (originalUserInfo) {
      setUserInfo(originalUserInfo) // Restaura os dados originais
    }
    setIsEditing(false)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const response = await api.put(`/users/${userInfo.id}`, userInfo)
      const updatedData = response.data

      // Atualiza ambos os estados com os novos dados salvos
      setUserInfo(updatedData)
      setOriginalUserInfo(updatedData)
      
      setIsEditing(false)
      // toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar o perfil:", error)
      // toast.error("Falha ao salvar. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    
    try {

      const fileExt = file.name.split('.').pop()
      const fileName = `${userInfo.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-images') // Make sure this bucket exists in your Supabase storage
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        // Send the full Supabase URL to your backend
        try {
          const response = await api.put(`/users/${userInfo.id}`, {
            ...userInfo,
            avatar: urlData.publicUrl // This should be the full Supabase URL
          })

          const updatedUserData = response.data
          setUserInfo(updatedUserData)
          setOriginalUserInfo(updatedUserData)
          
          console.log('Avatar uploaded and updated successfully:', urlData.publicUrl)
          console.log(userInfo)
          console.log(originalUserInfo)

        } catch (dbError) {
          console.error('Error updating avatar in database:', dbError)
        }
      }

    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (loading) return <div className="p-4 text-center">Carregando perfil...</div>

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <div className="relative group">
                    <Avatar
                      className={`h-24 w-24 ${isEditing ? 'cursor-pointer' : ''} ${isUploadingAvatar ? 'opacity-50' : ''}`}
                      onClick={handleAvatarClick}
                    >
                      <AvatarImage src={userInfo.avatar} alt="Profile" />
                      <AvatarFallback className="text-lg">
                        {isUploadingAvatar ? <Loader2 className="h-6 w-6 animate-spin" /> : 'JS'}
                      </AvatarFallback>
                    </Avatar>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />

                    {isEditing && !isUploadingAvatar && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={isEditing ? handleAvatarClick : undefined}
                      disabled={!isEditing || isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                    <p className="text-muted-foreground">{userInfo.email}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <Badge variant="secondary">Membro Ativo</Badge>
                      <Badge variant="outline">{userInfo.role}</Badge>
                    </div>
                    {isEditing && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Clique na foto para alterar sua imagem de perfil
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={isEditing ? handleCancel : handleEditClick}
                    variant={isEditing ? "secondary" : "outline"}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
                <TabsTrigger value="activity">Atividade</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Gerencie suas informações pessoais e de contato
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={userInfo.name}
                            disabled={!isEditing || isSaving}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={userInfo.email}
                            disabled={!isEditing || isSaving}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={userInfo.phone}
                            disabled={!isEditing || isSaving}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Localização</Label>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            value={userInfo.location}
                            disabled={!isEditing || isSaving}
                            onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        placeholder="Fale um pouco sobre você..."
                        value={userInfo.bio}
                        disabled={!isEditing || isSaving}
                        onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}