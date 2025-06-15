"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Settings, 
  Bell, 
  Shield, 
  Edit,
  Camera,
  Upload
} from "lucide-react"
import { useState, useRef } from "react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 99999-9999",
    location: "São Paulo, SP",
    bio: "Desenvolvedor apaixonado por tecnologia e doações sociais.",
    joinDate: "Janeiro 2024",
    avatar: "/placeholder-avatar.jpg"
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUserInfo({ ...userInfo, avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

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
                      className={`h-24 w-24 ${isEditing ? 'cursor-pointer' : ''}`}
                      onClick={handleAvatarClick}
                    >
                      <AvatarImage src={userInfo.avatar} alt="Profile" />
                      <AvatarFallback className="text-lg">JS</AvatarFallback>
                    </Avatar>
                    
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {/* Edit overlay when in edit mode */}
                    {isEditing && (
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    )}
                    
                    {/* Camera button - now shows different icon based on edit mode */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={handleAvatarClick}
                      disabled={!isEditing}
                    >
                      {isEditing ? <Upload className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                    <p className="text-muted-foreground">{userInfo.email}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <Badge variant="secondary">Membro Ativo</Badge>
                      <Badge variant="outline">Doador</Badge>
                    </div>
                    {isEditing && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Clique na foto para alterar sua imagem de perfil
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
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
                            disabled={!isEditing}
                            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
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
                            disabled={!isEditing}
                            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
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
                            disabled={!isEditing}
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
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
                            disabled={!isEditing}
                            onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
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
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>
                          Salvar Alterações
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificações
                      </CardTitle>
                      <CardDescription>
                        Configure suas preferências de notificação
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificações por Email</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber atualizações por email
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Notificações Push</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber notificações no navegador
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Newsletter</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber newsletter mensal
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Privacidade e Segurança
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Perfil Público</Label>
                          <p className="text-sm text-muted-foreground">
                            Tornar perfil visível para outros usuários
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Autenticação Dois Fatores</Label>
                          <p className="text-sm text-muted-foreground">
                            Adicionar camada extra de segurança
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <Button variant="destructive" className="w-full">
                        Alterar Senha
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                    <CardDescription>
                      Histórico das suas ações na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-2 w-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Doação realizada</p>
                          <p className="text-sm text-muted-foreground">
                            Você fez uma doação para "Projeto Educação"
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">2h atrás</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex h-2 w-2 bg-green-600 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Perfil atualizado</p>
                          <p className="text-sm text-muted-foreground">
                            Informações pessoais foram alteradas
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">1 dia atrás</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex h-2 w-2 bg-purple-600 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Nova organização seguida</p>
                          <p className="text-sm text-muted-foreground">
                            Você começou a seguir "ONG Esperança"
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">3 dias atrás</div>
                      </div>
                    </div>
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
