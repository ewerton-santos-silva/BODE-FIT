export function calculateBMR(weight, height, age, gender, activityLevel) {
    // Harris-Benedict
    let bmr;
    if (gender === "M") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        athlete: 1.9
    };

    return bmr * (multipliers[activityLevel] || 1.2);
}

export function calculateMacros(tdee, goal) {
    let calories = tdee;
    if (goal === "lose") calories -= 500;
    if (goal === "gain") calories += 500;

    // Standard distribution: 30% protein, 45% carbs, 25% fat
    const proteinCals = calories * 0.30;
    const carbCals = calories * 0.45;
    const fatCals = calories * 0.25;

    return {
        calories: Math.round(calories),
        protein: Math.round(proteinCals / 4), // 4 cal/g
        carbs: Math.round(carbCals / 4),      // 4 cal/g
        fats: Math.round(fatCals / 9)         // 9 cal/g
    };
}

export function generateWorkoutPlan(goal, activityLevel) {
    let routineType = "A/B/C";
    let routineDesc = "Treino dividido em 3 dias, focando em grupos musculares diferentes para manter a consistência e recuperação.";

    if (activityLevel === "sedentary") {
        routineType = "Full Body (Corpo Todo)";
        routineDesc = "3x na semana, focado em adaptação anatômica e fortalecimento geral.";
    } else if (activityLevel === "athlete") {
        routineType = "Split Avançado (A/B/C/D/E)";
        routineDesc = "Treino isolado diário para maximizar hipertrofia e performance.";
    } else if (goal === "lose") {
        routineType = "A/B + HIIT";
        routineDesc = "Treino de força alternado com cardio de alta intensidade para acelerar queima de gordura.";
    }

    return { routineType, routineDesc };
}

export function calculateEvolutionLogic(currentWeight, previousWeight, goal) {
    if (!previousWeight) return "Continue focado no plano atual para estabelecer uma base.";

    const diff = previousWeight - currentWeight;

    if (goal === "lose") {
        if (diff <= 0) return "Peso estagnado ou subiu. Recomendado reduzir 200 calorias diárias ou adicionar 15 min de cardio HIIT/dia.";
        if (diff > 1.5) return "Perda de peso muito rápida. Recomendado aumentar 100-200 calorias diárias focado em proteínas para evitar perda de massa magra.";
        return "Excelente progresso na perda de peso. Mantenha o plano atual.";
    }

    if (goal === "gain") {
        if (diff >= 0) {
            if (diff < 0.2) return "Ganho de peso muito lento. Adicione 200 calorias à dieta focado em carboidratos complexos.";
            return "Ótimo ritmo de ganho de massa. Mantenha o plano.";
        }
        return "Você perdeu peso. Aumente a ingestão calórica e diminua o gasto em exercícios aeróbicos.";
    }

    return "Mantenha a consistência. O objetivo de manutenção requer foco nos treinos para melhora da composição corporal.";
}
