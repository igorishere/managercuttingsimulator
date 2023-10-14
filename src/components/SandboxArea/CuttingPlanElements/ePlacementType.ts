export enum ePlacementType {
    Sheet = "Sheet",
    Part = "Part",
    Remainder = "Remainder"
}

export type ePlacementTypeStrings = keyof typeof ePlacementType;