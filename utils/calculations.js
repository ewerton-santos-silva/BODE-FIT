export function calculateBMR(weight, height, age, gender, activityLevel) {
    let bmr;
    if (gender === "M") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    const multipliers = {
        sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, athlete: 1.9
    };
    return bmr * (multipliers[activityLevel] || 1.2);
}

export function calculateMacros(tdee, goal) {
    let calories = tdee;
    if (goal === "lose") calories -= 500;
    if (goal === "gain") calories += 500;
    return {
        calories: Math.round(calories),
        protein: Math.round((calories * 0.30) / 4),
        carbs: Math.round((calories * 0.45) / 4),
        fats: Math.round((calories * 0.25) / 9),
    };
}

export function generateWorkoutPlan(goal, activityLevel) {
    const plans = {
        sedentary: {
            routineType: "Full Body (Corpo Todo)",
            routineDesc: "3x na semana, focado em adaptação anatômica e fortalecimento geral.",
            days: [
                { day: "Segunda", workout: "Full Body Leve" },
                { day: "Terça", workout: "Descanso ou Caminhada 20 min" },
                { day: "Quarta", workout: "Full Body Moderado" },
                { day: "Quinta", workout: "Descanso Total" },
                { day: "Sexta", workout: "Full Body Leve + Core" },
                { day: "Sábado", workout: "Lazer Ativo (Ex: Bicicleta)" },
                { day: "Domingo", workout: "Descanso Total" },
            ],
        },
        athlete: {
            routineType: "Split Avançado (A/B/C/D/E)",
            routineDesc: "Treino isolado diário para maximizar hipertrofia e performance.",
            days: [
                { day: "Segunda", workout: "Peito e Core" },
                { day: "Terça", workout: "Costas e Lombar" },
                { day: "Quarta", workout: "Pernas (Quadríceps)" },
                { day: "Quinta", workout: "Ombros e Trapézio" },
                { day: "Sexta", workout: "Braços (Bíceps/Tríceps)" },
                { day: "Sábado", workout: "Pernas (Posterior)" },
                { day: "Domingo", workout: "Descanso ou Mobilidade" },
            ],
        },
        lose: {
            routineType: "A/B + HIIT",
            routineDesc: "Força alternado com cardio de alta intensidade para queima de gordura.",
            days: [
                { day: "Segunda", workout: "Treino A (Superiores) + 15min HIIT" },
                { day: "Terça", workout: "Cardio Moderado (40 min)" },
                { day: "Quarta", workout: "Treino B (Inferiores) + 15min HIIT" },
                { day: "Quinta", workout: "Cardio Moderado (40 min)" },
                { day: "Sexta", workout: "Circuito Cardio + Força" },
                { day: "Sábado", workout: "Treino B + Core" },
                { day: "Domingo", workout: "Descanso Total" },
            ],
        },
        default: {
            routineType: "A/B/C",
            routineDesc: "Treino dividido em 3 dias, focando em grupos musculares diferentes.",
            days: [
                { day: "Segunda", workout: "Treino A — Peito, Ombro, Tríceps" },
                { day: "Terça", workout: "Treino B — Costas e Bíceps" },
                { day: "Quarta", workout: "Descanso Ativo (Caminhada 30 min)" },
                { day: "Quinta", workout: "Treino C — Pernas e Abdômen" },
                { day: "Sexta", workout: "Treino A — Foco Força" },
                { day: "Sábado", workout: "Treino B — Foco Força" },
                { day: "Domingo", workout: "Descanso Total" },
            ],
        },
    };

    if (activityLevel === "sedentary") return plans.sedentary;
    if (activityLevel === "athlete") return plans.athlete;
    if (goal === "lose") return plans.lose;
    return plans.default;
}

export function calculateEvolutionLogic(currentWeight, previousWeight, goal) {
    if (!previousWeight) return "Continue focado no plano atual para estabelecer uma base.";
    const diff = previousWeight - currentWeight;
    if (goal === "lose") {
        if (diff <= 0) return "Peso estagnado ou subiu. Reduza 200 cal diárias ou adicione 15 min de HIIT/dia.";
        if (diff > 1.5) return "Perda muito rápida. Aumente 100-200 cal/dia com foco em proteínas para preservar massa magra.";
        return "Excelente progresso! Mantenha o plano atual.";
    }
    if (goal === "gain") {
        if (diff >= 0) {
            if (diff < 0.2) return "Ganho lento. Adicione 200 cal/dia focando em carboidratos complexos.";
            return "Ótimo ritmo de ganho de massa. Mantenha o plano!";
        }
        return "Você perdeu peso. Aumente a ingestão calórica e reduza aeróbicos.";
    }
    return "Mantenha a consistência. Foco nos treinos para melhora da composição corporal.";
}
