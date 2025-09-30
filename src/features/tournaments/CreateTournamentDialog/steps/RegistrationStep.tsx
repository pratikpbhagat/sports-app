import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    registrationStart: string;
    registrationEnd: string;
    setRegistrationStart: (v: string) => void;
    setRegistrationEnd: (v: string) => void;
};

export default function RegistrationStep({ registrationStart, registrationEnd, setRegistrationStart, setRegistrationEnd }: Props) {
    return (
        <section className="grid grid-cols-2 gap-3">
            <Label>
                <span className="text-xs text-slate-600">Registration start</span>
                <Input type="date" value={registrationStart} onChange={(e) => setRegistrationStart(e.target.value)} />
            </Label>

            <Label>
                <span className="text-xs text-slate-600">Registration end</span>
                <Input type="date" value={registrationEnd} onChange={(e) => setRegistrationEnd(e.target.value)} />
            </Label>
        </section>
    );
}
