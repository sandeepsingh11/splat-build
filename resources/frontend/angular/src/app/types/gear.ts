import { SkillResponse } from "./responses/skill-response";

export interface Gear {
    id: number,
    user_id: number,
    gear_title: string | null,
    gear_desc: string | null,
    base_gear_id: number,
    created_at: string,
    updated_at: string,
    base_gear_name: string,
    skills?: SkillResponse[]
}