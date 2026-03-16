export type ProvincePopulation = {
    province: string;
    population: number;
    year: number;
};

export type ProvincePopulationData = ProvincePopulation[];

export type HousingPriceIndex = {
    province: string;
    year: number;
    index: number;
};

export type HousingPriceIndexData = HousingPriceIndex[];  