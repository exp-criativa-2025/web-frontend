"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Share2,
  Heart,
  Star,
  TrendingUp,
  DollarSign,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/lib/api";
import { Campaign } from "../../campaigns/page";

interface AcademicEntity {
  id: string;
  type: string;
  fantasy_name: string;
  cnpj: string;
  foundation_date: string;
  status: string;
  cep: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  description?: string;
  member_count?: number;
  total_donations?: number;
  active_campaigns?: number;
  logo?: string;
}

export default function AcademicEntityDetailPage({p}) {
  const params = useParams();
  const [entity, setEntity] = useState<AcademicEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>()
  
  const router = useRouter()

  useEffect(() => {
    const mockEntity: AcademicEntity = {
      id: params.id as string,
      type: "Centro Acadêmico",
      fantasy_name: "Centro Acadêmico de Engenharia",
      cnpj: "12.345.678/0001-90",
      foundation_date: "2010-03-15",
      status: "Ativo",
      cep: "01234-567",
      address: "Rua das Universidades, 123 - São Paulo, SP",
      phone: "(11) 3456-7890",
      email: "contato@caengenharia.com.br",
      website: "https://caengenharia.com.br",
      facebook: "https://facebook.com/caengenharia",
      instagram: "https://instagram.com/caengenharia",
      description: "O Centro Acadêmico de Engenharia é uma organização estudantil que representa os alunos dos cursos de engenharia da universidade, promovendo atividades acadêmicas, culturais e sociais para o desenvolvimento integral dos estudantes.",
      member_count: 450,
      total_donations: 125000,
      active_campaigns: 3,
      logo: "/placeholder-logo.png"
    };

    const fetchData = async () => {
      const res = await api.get('/academic-entities/1')
      console.log(`the id: ${params.id}`)
      console.log(`the id: ${p}`)
      const resolved = res.data

      const newEntity: AcademicEntity = {
        ...mockEntity,
        fantasy_name: resolved.fantasy_name ?? mockEntity.fantasy_name,
        type: resolved.type ?? mockEntity.type,
        cnpj: resolved.cnpj ?? mockEntity.cnpj,
        foundation_date: resolved.foundation_date ?? mockEntity.foundation_date,
        status: resolved.status ?? mockEntity.status,
        cep: resolved.cep ?? mockEntity.cep,
        address: resolved.address ?? mockEntity.address,
        phone: resolved.phone ?? mockEntity.phone,
        email: resolved.email ?? mockEntity.email,
        website: resolved.website ?? mockEntity.website,
        facebook: resolved.facebook ?? mockEntity.facebook,
        instagram: resolved.instagram ?? mockEntity.instagram,
        description: resolved.description ?? mockEntity.description,
        member_count: resolved.member_count ?? mockEntity.member_count,
        total_donations: resolved.total_donations ?? mockEntity.total_donations,
        active_campaigns: resolved.active_campaigns ?? mockEntity.active_campaigns,
        logo: resolved.logo ?? mockEntity.logo,
        id: resolved.id ?? mockEntity.id,
      };

      setEntity(newEntity);
    }

    const getCampaigns = async () => {
      const res = await api.get('/campaigns')
      const filtered = res.data as Array<Campaign>
      const mine = filtered.filter((element) => element.academic_entity.id === 1)
      console.log(filtered)
      console.log(mine)
      setCampaigns(mine)
    }

    setTimeout(() => {
      setEntity(mockEntity);
      fetchData()
      getCampaigns()
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Entidade não encontrada</h2>
          <p className="text-gray-600">A entidade solicitada não existe ou foi removida.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with background image */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
        <Image
          src="/academic-header-bg.jpg"
          alt="Header background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Header content */}
        <div className="relative h-full flex items-end p-6">
          <div className="flex items-end gap-6 w-full">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={entity.logo} alt={entity.fantasy_name} />
              <AvatarFallback className="text-2xl bg-white text-blue-600">
                {entity.fantasy_name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-white mb-2">
              <h1 className="text-3xl font-bold mb-2">{entity.fantasy_name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {entity.type}
                </Badge>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  São Paulo, SP
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Desde {format(new Date(entity.foundation_date), "yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with resizable panels */}
      <div className="p-6">
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          {/* Left Panel - Main Information */}
          <ResizablePanel defaultSize={70} minSize={50}>
            <div className="pr-4 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{entity.member_count?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Membros</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0
                          }).format(entity.total_donations || 0)}
                        </p>
                        <p className="text-sm text-gray-600">Arrecadado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaigns?.length}</p>
                        <p className="text-sm text-gray-600">Campanhas Ativas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Sobre a Organização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {entity.description}
                  </p>
                </CardContent>
              </Card>

              {/* Recent Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Campanhas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns?.map((val, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Heart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{val.name}</h4>
                          <p className="text-sm text-gray-600">Ajuda para estudantes em situação de vulnerabilidade</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                              className="h-2 bg-green-500 rounded-full transition-all duration-300"
                              style={{
                                width: val.total_donations && val.goal
                                ? `${Math.min(100, Math.round((val.total_donations / val.goal) * 100))}%`
                                : "0%"
                              }}
                              ></div>
                            </div>
                            <span>{val.total_donations && val.goal
                              ? `${Math.round((val.total_donations / val.goal) * 100)}%`
                              : "0%"}
                              </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm"
                          onClick={() => {
                            router.push(`/campaigns/${val.id}`)
                          }}
                        >
                          Ver mais
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Panel - Contact & Details */}
        <ResizablePanel defaultSize={30} minSize={25}>
          <div className="pl-4 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {entity.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-sm text-gray-600">{entity.address}</p>
                    </div>
                  </div>
                )}

                {entity.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-gray-600">{entity.phone}</p>
                    </div>
                  </div>
                )}

                {entity.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <p className="text-sm text-gray-600">{entity.email}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Social Links */}
                <div className="space-y-3">
                  <p className="font-medium">Redes Sociais</p>
                  <div className="flex gap-2">
                    {entity.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={entity.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {entity.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={entity.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {entity.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={entity.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Organização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">CNPJ</p>
                    <p>{entity.cnpj}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <Badge variant={entity.status === 'Ativo' ? 'default' : 'secondary'}>
                      {entity.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Fundação</p>
                    <p>{format(new Date(entity.foundation_date), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">CEP</p>
                    <p>{entity.cep}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Fazer Doação
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Entrar em Contato
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar Organização
                </Button>
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    </div >
  );
}
