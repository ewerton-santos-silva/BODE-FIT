"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Apple, Dumbbell, Flame, CheckCircle2, ChevronRight,
    Target, Droplets, Moon, Sun, Pencil
} from "lucide-react";
import { calculateBMR, calculateMacros, generateWorkoutPlan, calculateEvolutionLogic } from "@/utils/calculations";

// Dynamic import to prevent SSR crash (recharts uses browser-only APIs)
const WeightChart = dynamic(() => import("@/components/WeightChart"), { ssr: false });

export default function Home() {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        name: "", age: "", gender: "M", height: "", weight: "",
        activityLevel: "sedentary", goal: "lose",
        neck: "", waist: "", hips: ""
    });
    const [plan, setPlan] = useState(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const historyData = [
        { name: "Sem 1", peso: Number(profile.weight) + 2 },
        { name: "Sem 2", peso: Number(profile.weight) + 1.2 },
        { name: "Sem 3", peso: Number(profile.weight) + 0.5 },
        { name: "Atual", peso: Number(profile.weight) },
    ];

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const generatePlan = (e) => {
        e.preventDefault();
        const tdee = calculateBMR(
            Number(profile.weight), Number(profile.height),
            Number(profile.age), profile.gender, profile.activityLevel
        );
        const macros = calculateMacros(tdee, profile.goal);
        const workout = generateWorkoutPlan(profile.goal, profile.activityLevel);
        const prevWeight = Number(profile.weight) + 1.2;
        const adjustment = calculateEvolutionLogic(Number(profile.weight), prevWeight, profile.goal);
        setPlan({ macros, workout, adjustment });
        setStep(2);
    };

    const ThemeToggle = () => (
        mounted ? (
            <Button
                variant="outline" size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-background/60 backdrop-blur border-slate-300 dark:border-slate-700"
            >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
        ) : <div className="w-10 h-10" />
    );

    const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

    // ── ONBOARDING ──────────────────────────────────────────────────
    if (step === 1) {
        return (
            <div
                className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center relative"
                style={{ backgroundImage: 'url("/bg.png")' }}
            >
                <div className="absolute inset-0 bg-white/85 dark:bg-slate-950/88 backdrop-blur-sm" />

                <div className="absolute top-4 right-4 z-20">
                    <ThemeToggle />
                </div>

                <Card className="w-full max-w-2xl shadow-2xl z-10 border border-slate-200 dark:border-slate-800 bg-white/97 dark:bg-slate-900/97">
                    <CardHeader className="flex flex-col items-center text-center pb-2">
                        <img
                            src="/logo.png"
                            alt="BODE FIT"
                            className="w-32 h-32 object-contain drop-shadow-lg mb-1"
                        />
                        <CardTitle className="text-3xl font-black uppercase tracking-widest text-primary">
                            BODE FIT
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                            Preencha seus dados para gerar seu plano adaptativo personalizado.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={generatePlan} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Nome</label>
                                    <Input name="name" required placeholder="Seu nome" onChange={handleInputChange} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Idade</label>
                                    <Input type="number" name="age" required placeholder="Anos" onChange={handleInputChange} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Sexo</label>
                                    <select name="gender" className={selectClass} onChange={handleInputChange} value={profile.gender}>
                                        <option value="M">Masculino</option>
                                        <option value="F">Feminino</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Altura (cm)</label>
                                    <Input type="number" name="height" required placeholder="Ex: 175" onChange={handleInputChange} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Peso (kg)</label>
                                    <Input type="number" name="weight" step="0.1" required placeholder="Ex: 80" onChange={handleInputChange} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Nível de Atividade</label>
                                    <select name="activityLevel" className={selectClass} onChange={handleInputChange} value={profile.activityLevel}>
                                        <option value="sedentary">Sedentário</option>
                                        <option value="light">Levemente Ativo</option>
                                        <option value="moderate">Moderadamente Ativo</option>
                                        <option value="active">Muito Ativo</option>
                                        <option value="athlete">Atleta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                <p className="text-sm font-semibold mb-3">Medidas Corporais <span className="font-normal text-muted-foreground">(Opcional)</span></p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[["neck", "Pescoço (cm)"], ["waist", "Cintura (cm)"], ["hips", "Quadril (cm)"]].map(([name, label]) => (
                                        <div key={name} className="space-y-1">
                                            <label className="text-xs">{label}</label>
                                            <Input type="number" name={name} onChange={handleInputChange} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                <p className="text-sm font-semibold mb-3">Objetivo Principal</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[["lose", "🔥 Emagrecer"], ["maintain", "⚖️ Manter"], ["gain", "💪 Ganhar Massa"]].map(([g, label]) => (
                                        <button
                                            type="button" key={g}
                                            onClick={() => setProfile({ ...profile, goal: g })}
                                            className={`p-3 border rounded-md text-sm font-semibold transition-all ${profile.goal === g
                                                ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                                : "hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full text-base h-12 font-bold uppercase tracking-wider">
                                Gerar Meu Plano <ChevronRight className="ml-1 w-5 h-5" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ── DASHBOARD ────────────────────────────────────────────────────
    return (
        <div
            className="min-h-screen relative p-4 sm:p-6 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: 'url("/bg.png")' }}
        >
            <div className="absolute inset-0 bg-slate-50/92 dark:bg-slate-950/92 pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-6 relative z-10">

                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="BODE FIT" className="w-12 h-12 object-contain" />
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-wide text-primary">BODE FIT</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Fala, {profile.name}! Seu plano está pronto.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <ThemeToggle />
                        <Button variant="outline" className="bg-background/80" onClick={() => setStep(1)}>
                            <Pencil className="w-4 h-4 mr-1" /> Editar Dados
                        </Button>
                    </div>
                </div>

                {/* Insight */}
                {plan?.adjustment && (
                    <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-900 dark:text-green-200 p-4 rounded-xl flex items-start gap-3">
                        <Target className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                        <div>
                            <p className="font-semibold text-sm">Inteligência do Plano</p>
                            <p className="text-sm">{plan.adjustment}</p>
                        </div>
                    </div>
                )}

                {/* Macros */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Calorias", value: `${plan?.macros.calories} kcal`, icon: <Flame className="w-4 h-4 text-orange-500" />, sub: "Total diário" },
                        { label: "Proteínas", value: `${plan?.macros.protein}g`, icon: <Dumbbell className="w-4 h-4 text-blue-500" />, sub: "30% da dieta" },
                        { label: "Carboidratos", value: `${plan?.macros.carbs}g`, icon: <Apple className="w-4 h-4 text-primary" />, sub: "45% da dieta" },
                        { label: "Gorduras", value: `${plan?.macros.fats}g`, icon: <Droplets className="w-4 h-4 text-yellow-500" />, sub: "25% da dieta" },
                    ].map(({ label, value, icon, sub }) => (
                        <Card key={label}>
                            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
                                {icon}
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="text-xs text-muted-foreground">{sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Workout Plan */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🏋️ Plano de Treino: {plan?.workout.routineType}</CardTitle>
                                <CardDescription>{plan?.workout.routineDesc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                                    {plan?.workout.days.map((d, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg border ${d.workout.toLowerCase().includes("descanso")
                                                ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70"
                                                : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"}`}
                                        >
                                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{d.day}</p>
                                            <p className="text-xs font-medium dark:text-slate-300 leading-snug">{d.workout}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weight Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>📈 Evolução de Peso</CardTitle>
                                <CardDescription>Curva das últimas semanas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <WeightChart data={historyData} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Checklist */}
                    <Card>
                        <CardHeader>
                            <CardTitle>✅ Checklist Diário</CardTitle>
                            <CardDescription>Mantenha a consistência</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                "Beber 3L de Água",
                                "Bater meta de Proteínas",
                                "Concluir o treino do dia",
                                "Dormir 7-8 horas",
                                "Evitar açúcar refinado",
                                "Registrar peso semanal",
                            ].map((task, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-primary rounded"
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{task}</span>
                                </label>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
