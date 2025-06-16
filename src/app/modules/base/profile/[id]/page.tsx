"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin } from "lucide-react"
import api, { getAvatarUrl } from "@/lib/api"

export default function ProfileViewPage() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const viewedUserId = params.id
    if (!viewedUserId) return

    async function checkAndFetchProfile() {
      setLoading(true)
      
      try {
        const meResponse = await api.get('/me')
        if (Number(viewedUserId) === meResponse.data.id) {
          router.push('/profile')
          return
        }
      } catch (error) {
        console.log("Usuário não logado, exibindo perfil público.")
      }

      try {
        const response = await api.get(`/users/${viewedUserId}`)
        const data = response.data

        const userData = {
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          avatar: getAvatarUrl(data.avatar) || "/default-avatar.png",
          role: data.role || "doador"
        }
        setUserProfile(userData)
      } catch (error) {
        console.error("Erro ao buscar dados do perfil do usuário:", error)
        setUserProfile(null)
      } finally {
        setLoading(false)
      }
    }

    checkAndFetchProfile()
  }, [params.id, router])

  if (loading) {
    return <div className="p-4 text-center">Carregando perfil...</div>
  }

  if (!userProfile) {
    return <div className="p-4 text-center">Usuário não encontrado.</div>
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile.avatar} alt="Profile" />
                      <AvatarFallback className="text-lg">
                        {userProfile.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                    <p className="text-muted-foreground">{userProfile.email}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                      <Badge variant="secondary">Membro Ativo</Badge>
                      <Badge variant="outline">{userProfile.role}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="activity">Atividade</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Informações de contato e perfil do usuário.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input id="name" value={userProfile.name} readOnly />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" value={userProfile.email} readOnly />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input id="phone" value={userProfile.phone} readOnly />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Localização</Label>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input id="location" value={userProfile.location} readOnly />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        placeholder="Este usuário não preencheu a biografia."
                        value={userProfile.bio}
                        readOnly
                      />
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