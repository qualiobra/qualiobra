
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentInspections } from "@/components/dashboard/RecentInspections";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { NonConformitiesChart } from "@/components/dashboard/NonConformitiesChart";
import { PendingTasks } from "@/components/dashboard/PendingTasks";
import { ObrasList } from "@/components/dashboard/ObrasList";
import { useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();
  const firstName = user?.firstName || "";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Olá, {firstName} 👋
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inspeções realizadas
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardHeader className="p-2">
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +10% em relação ao mês passado
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Não conformidades
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardHeader className="p-2">
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              -15% em relação ao mês passado
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conformidade geral
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardHeader className="p-2">
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +3% em relação ao mês passado
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inspeções pendentes
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardHeader className="p-2">
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              -2 em relação à semana passada
            </p>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Conformidade por Critério</CardTitle>
            <CardDescription>
              Distribuição de conformidade por critério de inspeção.
            </CardDescription>
          </CardHeader>
          <ComplianceChart />
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Não Conformidades</CardTitle>
            <CardDescription>
              Não conformidades identificadas nos últimos 30 dias.
            </CardDescription>
          </CardHeader>
          <NonConformitiesChart />
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ObrasList />
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inspeções Recentes</CardTitle>
          </CardHeader>
          <RecentInspections />
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
            <CardDescription>
              Lista de tarefas que precisam de sua atenção.
            </CardDescription>
          </CardHeader>
          <PendingTasks />
        </Card>
      </div>
    </div>
  );
}
