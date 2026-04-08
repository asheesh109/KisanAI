'use client';

import { useState, useCallback, useMemo } from 'react';

export interface EligibilityFilters {
  age?: number;
  gender?: string; // 'male' | 'female' | 'other'
  state?: string;
  district?: string;
  annualIncome?: string; // '<1L' | '1L-5L' | '>5L'
  landOwned?: boolean;
  landSize?: number;
  farmerType?: string; // 'small' | 'marginal' | 'large'
  socialCategory?: string; // 'general' | 'obc' | 'sc' | 'st'
  womenFarmer?: boolean;
  aadhaarAvailable?: boolean;
  bankAccountLinked?: boolean;
}

export interface SchemeRequirement {
  minAge?: number;
  maxAge?: number;
  preferredGender?: string[];
  applicableStates?: string[];
  maxAnnualIncome?: string; // '<1L' | '1L-5L' | '>5L'
  landRequirement?: {
    mustOwn?: boolean;
    minAcres?: number;
    maxAcres?: number;
  };
  farmerTypes?: string[]; // 'small' | 'marginal' | 'large'
  socialCategories?: string[]; // 'general' | 'obc' | 'sc' | 'st'
  womenFarmerSpecific?: boolean;
  requireAadhaar?: boolean;
  requireBankAccount?: boolean;
}

export interface Scheme {
  id: string;
  schemeName: string;
  schemeObjective: string;
  schemeBenefits: string;
  category: string;
  state?: string;
  requirement?: SchemeRequirement;
  [key: string]: any;
}

/**
 * Compare income levels
 * Returns true if userIncome is less than or equal to maxIncome
 */
const isIncomeEligible = (userIncome: string | undefined, maxIncome: string | undefined): boolean => {
  if (!maxIncome) return true;
  if (!userIncome) return false;

  // Income ranges: '<1L', '1L-5L', '>5L'
  const incomeRanks = { '<1L': 0, '1L-5L': 1, '>5L': 2 };
  const userRank = incomeRanks[userIncome as keyof typeof incomeRanks];
  const maxRank = incomeRanks[maxIncome as keyof typeof incomeRanks];

  return userRank <= maxRank;
};

/**
 * Check if user is eligible for a specific scheme
 */
const isUserEligibleForScheme = (
  user: EligibilityFilters,
  scheme: Scheme | any
): boolean => {
  const requirement = scheme.requirement || {};

  // Age check
  if (requirement.minAge && user.age && user.age < requirement.minAge) {
    return false;
  }
  if (requirement.maxAge && user.age && user.age > requirement.maxAge) {
    return false;
  }

  // Gender check
  if (
    requirement.preferredGender &&
    requirement.preferredGender.length > 0 &&
    user.gender
  ) {
    if (!requirement.preferredGender.includes(user.gender)) {
      return false;
    }
  }

  // State check
  if (
    requirement.applicableStates &&
    requirement.applicableStates.length > 0 &&
    user.state
  ) {
    if (!requirement.applicableStates.includes(user.state)) {
      return false;
    }
  }

  // Income check
  if (!isIncomeEligible(user.annualIncome, requirement.maxAnnualIncome)) {
    return false;
  }

  // Land ownership check
  if (requirement.landRequirement) {
    if (requirement.landRequirement.mustOwn && !user.landOwned) {
      return false;
    }

    if (user.landSize) {
      if (
        requirement.landRequirement.minAcres &&
        user.landSize < requirement.landRequirement.minAcres
      ) {
        return false;
      }
      if (
        requirement.landRequirement.maxAcres &&
        user.landSize > requirement.landRequirement.maxAcres
      ) {
        return false;
      }
    }
  }

  // Farmer type check
  if (
    requirement.farmerTypes &&
    requirement.farmerTypes.length > 0 &&
    user.farmerType
  ) {
    if (!requirement.farmerTypes.includes(user.farmerType)) {
      return false;
    }
  }

  // Social category check
  if (
    requirement.socialCategories &&
    requirement.socialCategories.length > 0 &&
    user.socialCategory
  ) {
    if (!requirement.socialCategories.includes(user.socialCategory)) {
      return false;
    }
  }

  // Women farmer specific
  if (requirement.womenFarmerSpecific && !user.womenFarmer) {
    return false;
  }

  // Document requirements
  if (requirement.requireAadhaar && !user.aadhaarAvailable) {
    return false;
  }

  if (requirement.requireBankAccount && !user.bankAccountLinked) {
    return false;
  }

  return true;
};

/**
 * Hook for filtering schemes based on eligibility and other filters
 */
export const useSchemeFilter = (schemes: Scheme[]) => {
  const [eligibilityFilters, setEligibilityFilters] = useState<EligibilityFilters>({});
  const [existingFilters, setExistingFilters] = useState<{
    selectedState?: string;
    selectedCategory?: string;
    searchTerm?: string;
  }>({});

  /**
   * Update a single eligibility filter
   */
  const updateFilter = useCallback(
    (filterKey: keyof EligibilityFilters, value: any) => {
      setEligibilityFilters((prev) => ({
        ...prev,
        [filterKey]: value,
      }));
    },
    []
  );

  /**
   * Update multiple existing filters (state, category, search)
   */
  const updateExistingFilters = useCallback(
    (filters: Partial<typeof existingFilters>) => {
      setExistingFilters((prev) => ({
        ...prev,
        ...filters,
      }));
    },
    []
  );

  /**
   * Reset eligibility filters
   */
  const resetFilters = useCallback(() => {
    setEligibilityFilters({});
  }, []);

  /**
   * Reset all filters including existing ones
   */
  const resetAllFilters = useCallback(() => {
    setEligibilityFilters({});
    setExistingFilters({});
  }, []);

  /**
   * Get filtered schemes based on all applied filters
   */
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      // Apply existing filters (state, category, search)
      if (existingFilters.selectedState && scheme.state !== existingFilters.selectedState) {
        return false;
      }

      if (existingFilters.selectedCategory && scheme.category !== existingFilters.selectedCategory) {
        return false;
      }

      // Apply eligibility filters
      if (Object.keys(eligibilityFilters).length > 0) {
        if (!isUserEligibleForScheme(eligibilityFilters, scheme)) {
          return false;
        }
      }

      return true;
    });
  }, [schemes, eligibilityFilters, existingFilters]);

  /**
   * Get count of eligible schemes without applying existing filters
   * Used to show "only eligibility check" count
   */
  const eligibilityOnlyCount = useMemo(() => {
    if (Object.keys(eligibilityFilters).length === 0) {
      return schemes.length;
    }

    return schemes.filter((scheme) =>
      isUserEligibleForScheme(eligibilityFilters, scheme)
    ).length;
  }, [schemes, eligibilityFilters]);

  return {
    eligibilityFilters,
    existingFilters,
    updateFilter,
    updateExistingFilters,
    filteredSchemes,
    resetFilters,
    resetAllFilters,
    eligibilityOnlyCount,
  };
};

export default useSchemeFilter;
