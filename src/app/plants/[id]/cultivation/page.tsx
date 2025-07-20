// src/app/plants/[id]/cultivation/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Sun, Thermometer, Droplets, Wind } from "lucide-react";
import { plantService } from "@/services/plant.service";
import { notFound } from "next/navigation";

interface CultivationPageProps {
    params: { id: string };
}

export default async function CultivationPage({ params }: CultivationPageProps) {
    const plant = await plantService.getPlant(params.id);

    if (!plant) {
        notFound();
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Sun className="mr-2 text-primary"/>Sunlight</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Full sun to partial shade. Prefers at least 4-6 hours of direct sunlight per day.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Droplets className="mr-2 text-primary"/>Watering</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Water regularly, allowing the soil to dry out slightly between waterings. Avoid overwatering.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Thermometer className="mr-2 text-primary"/>Climate</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Prefers warm and humid climates. Protect from frost. Ideal temperature range is 20-35°C (68-95°F).</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Leaf className="mr-2 text-primary"/>Soil</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Well-draining, fertile soil with a pH between 6.0 and 7.5. Rich in organic matter.</p>
            </CardContent>
        </Card>
         <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Growth & Propagation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">Propagation</h4>
                    <p className="text-muted-foreground">Typically propagated from seeds or cuttings. Seeds can be sown directly in the garden after the last frost.</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Harvesting</h4>
                    <p className="text-muted-foreground">Leaves can be harvested as needed throughout the growing season. For roots or flowers, wait until the plant is mature.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
