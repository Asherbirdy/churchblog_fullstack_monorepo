import { HCORadioEnums, SpecialtyRadioEnums } from '@/enums'

export const selectOption = {
  // 行業 Sectors
  sectors: [
    {
      label: '醫院',
      value: 'HP'
    },
    {
      label: '診所',
      value: 'GP'
    },
    {
      label: '藥局',
      value: 'DS'
    }
  ].map((sector) => (
    {
      label: sector.label,
      value: sector.value
    }
  )),
  HCO_Radiogroup: [
    {
      label: '醫療院所',
      value: HCORadioEnums.CurrentHCO
    },
    {
      label: '其他',
      value: HCORadioEnums.OtherHCO
    }
  ].map((HCO) => ({ label: HCO.label, value: HCO.value })),

  specialty_Radiogroup: [
    {
      label: '科別',
      value: SpecialtyRadioEnums.CurrentSpecialty
    },
    {
      label: '其他',
      value: SpecialtyRadioEnums.OtherSpecialty
    }
  ].map((specialty) => ({ label: specialty.label, value: specialty.value })),

}