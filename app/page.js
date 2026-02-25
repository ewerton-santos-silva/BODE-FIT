"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Apple, Dumbbell, Flame, CheckCircle2, ChevronRight, Target, Droplets, Moon, Sun } from "lucide-react";
import { calculateBMR, calculateMacros, generateWorkoutPlan, calculateEvolutionLogic } from "@/utils/calculations";

export default function Home() {
    const [step, setStep] = useState(1); // 1 = Onboarding, 2 = Dashboard
    const [profile, setProfile] = useState({
        name: "",
        age: "",
        gender: "M",
        height: "",
        weight: "",
        activityLevel: "sedentary",
        goal: "lose",
        neck: "",
        waist: "",
        hips: ""
    });

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mock history for chart
    const historyData = [
        { name: "Semana 1", peso: Number(profile.weight) + 2 },
        { name: "Semana 2", peso: Number(profile.weight) + 1.2 },
        { name: "Semana 3", peso: Number(profile.weight) + 0.5 },
        { name: "Atual", peso: Number(profile.weight) },
    ];

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const generatePlan = (e) => {
        e.preventDefault();
        const tdee = calculateBMR(
            Number(profile.weight),
            Number(profile.height),
            Number(profile.age),
            profile.gender,
            profile.activityLevel
        );
        const macros = calculateMacros(tdee, profile.goal);
        const workout = generateWorkoutPlan(profile.goal, profile.activityLevel);
        const prevWeight = Number(profile.weight) + 1.2; // mock previous week info
        const adjustment = calculateEvolutionLogic(Number(profile.weight), prevWeight, profile.goal);

        setPlan({
            macros,
            workout,
            adjustment
        });
        setStep(2);
    };

    if (step === 1) {
        return (
            <div
                className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: 'url("/bg.png")' }}
            >
                <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-0"></div>
                <div className="absolute top-4 right-4 z-20">
                    {mounted && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="bg-background/50 backdrop-blur-md"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    )}
                </div>
                <Card className="w-full max-w-2xl shadow-xl z-10 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Activity className="text-primary" /> Bem-vindo(a) ao BODE FIT
                        </CardTitle>
                        <CardDescription>Preencha seus dados biométricos para gerar seu plano adaptativo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={generatePlan} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome</label>
                                    <Input name="name" required placeholder="Seu nome" onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Idade</label>
                                    <Input type="number" name="age" required placeholder="Anos" onChange={handleInputChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sexo</label>
                                    <select
                                        name="gender"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-ring"
                                        onChange={handleInputChange}
                                        value={profile.gender}
                                    >
                                        <option value="M">Masculino</option>
                                        <option value="F">Feminino</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Altura (cm)</label>
                                    <Input type="number" name="height" required placeholder="Ex: 175" onChange={handleInputChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Peso (kg)</label>
                                    <Input type="number" name="weight" step="0.1" required placeholder="Ex: 80" onChange={handleInputChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nível de Atividade</label>
                                    <select
                                        name="activityLevel"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                        onChange={handleInputChange}
                                        value={profile.activityLevel}
                                    >
                                        <option value="sedentary">Sedentário</option>
                                        <option value="light">Levemente Ativo</option>
                                        <option value="moderate">Moderadamente Ativo</option>
                                        <option value="active">Muito Ativo</option>
                                        <option value="athlete">Atleta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                <h3 className="font-semibold mb-3">Medidas Corporais (Opcional, para cálculo de % de Gordura)</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs">Pescoço (cm)</label>
                                        <Input type="number" name="neck" onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs">Cintura (cm)</label>
                                        <Input type="number" name="waist" onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs">Quadril (cm)</label>
                                        <Input type="number" name="hips" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                                <label className="text-sm font-medium">Objetivo Principal</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["lose", "maintain", "gain"].map((g) => (
                                        <button
                                            type="button"
                                            key={g}
                                            onClick={() => setProfile({ ...profile, goal: g })}
                                            className={`p-3 border rounded-md text-sm font-medium transition-colors ${profile.goal === g
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900"
                                                }`}
                                        >
                                            {g === "lose" ? "Emagrecer" : g === "maintain" ? "Manter" : "Ganhar Massa"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full text-lg h-12 font-bold uppercase tracking-wider">
                                Gerar Meu Plano Personalizado <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative p-4 sm:p-6" style={{ backgroundImage: 'url("/bg.png")', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm z-0 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-6 relative z-10">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 uppercase text-primary">BODE FIT</h1>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Fala, {profile.name}! Aqui está o seu plano atualizado.</p>
                    </div>
                    <div className="flex gap-2">
                        {mounted && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="bg-background/80 backdrop-blur"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        )}
                        <Button variant="outline" className="bg-background/80 backdrop-blur" onClick={() => setStep(1)}>
                            Atualizar Dados
                        </Button>
                    </div>
                </div>

                {plan?.adjustment && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start gap-3">
                        <Target className="w-6 h-6 text-blue-600 shrink-0" />
                        <div>
                            <h4 className="font-semibold">Insights da Inteligência do Plano</h4>
                            <p className="text-sm">{plan.adjustment}</p>
                        </div>
                    </div>
                )}

                {/* Grid de Macros e Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Calorias Diárias</CardTitle>
                            <Flame className="w-4 h-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{plan?.macros.calories} kcal</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Proteínas</CardTitle>
                            <Dumbbell className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{plan?.macros.protein}g</div>
                            <p className="text-xs text-muted-foreground">30% da dieta</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Carboidratos</CardTitle>
                            <Apple className="w-4 h-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{plan?.macros.carbs}g</div>
                            <p className="text-xs text-muted-foreground">45% da dieta</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Gorduras</CardTitle>
                            <Droplets className="w-4 h-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{plan?.macros.fats}g</div>
                            <p className="text-xs text-muted-foreground">25% da dieta</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Plano de Treino Sugerido: {plan?.workout.routineType}</CardTitle>
                                <CardDescription>{plan?.workout.routineDesc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                    {plan?.workout.days.map((d, index) => (
                                        <div key={index} className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-800">
                                            <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{d.day}</p>
                                            <p className="text-sm dark:text-slate-300 font-medium">{d.workout}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Evolução de Peso</CardTitle>
                                <CardDescription>Acompanhamento das últimas semanas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={historyData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="peso" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Checklist Diário</CardTitle>
                                <CardDescription>Mantenha a consistência</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    "Beber 3L de Água",
                                    "Comer a meta de Proteínas",
                                    "Concluir o treino planejado",
                                    "Dormir 7-8 horas",
                                    "Evitar açúcar refinado"
                                ].map((task, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span className="text-sm font-medium">{task}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
