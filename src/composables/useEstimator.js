import services from '@/config/serviceConfig'

const roundMoney = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100

export function useEstimator() {
  const calculateEstimate = (serviceId, form) => {
    const service = services[serviceId]

    if (!service) {
      throw new Error('Invalid service selected.')
    }

    const wastePercent = Number(form.wastePercent ?? service.defaultWaste ?? 0)
    const wasteFactor = 1 + wastePercent / 100
    const markupPercent = Number(form.markupPercent ?? 0)

    switch (serviceId) {
      case 'tiling': {
        const area = Number(form.area || 0)
        const adjustedArea = area * wasteFactor
        const tileCoverage = Number(form.tileCoverage || 0)
        const tileBoxes = tileCoverage > 0 ? Math.ceil(adjustedArea / tileCoverage) : 0
        const tileCost = tileBoxes * Number(form.tileBoxPrice || 0)
        const adhesiveCoverage = Number(form.adhesiveCoverage || 0)
        const adhesiveBags = adhesiveCoverage > 0 ? Math.ceil(adjustedArea / adhesiveCoverage) : 0
        const adhesiveCost = adhesiveBags * Number(form.adhesiveBagPrice || 0)
        const materialsCost = tileCost + adhesiveCost
        const laborCost = area * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue

        return {
          service: service.title,
          wastePercent,
          metrics: {
            area,
            adjustedArea: roundMoney(adjustedArea),
            tileBoxes,
            adhesiveBags
          },
          costs: {
            tileCost: roundMoney(tileCost),
            adhesiveCost: roundMoney(adhesiveCost),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          }
        }
      }
      case 'plumbing': {
        const fixtures = Number(form.fixtures || 0)
        const pipeLength = Number(form.pipeLength || 0)
        const adjustedPipeLength = pipeLength * wasteFactor
        const pipeCost = adjustedPipeLength * Number(form.pipeCostPerFt || 0)
        const fittingsCost = Number(form.fittingsCost || 0)
        const materialsCost = pipeCost + fittingsCost
        const laborCost = fixtures * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue

        return {
          service: service.title,
          wastePercent,
          metrics: {
            fixtures,
            pipeLength,
            adjustedPipeLength: roundMoney(adjustedPipeLength)
          },
          costs: {
            pipeCost: roundMoney(pipeCost),
            fittingsCost: roundMoney(fittingsCost),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          }
        }
      }
      case 'electrical': {
        const points = Number(form.points || 0)
        const wireLength = Number(form.wireLength || 0)
        const adjustedWireLength = wireLength * wasteFactor
        const wireCost = adjustedWireLength * Number(form.wireCostPerFt || 0)
        const accessoriesCost = Number(form.accessoriesCost || 0)
        const materialsCost = wireCost + accessoriesCost
        const laborCost = points * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue

        return {
          service: service.title,
          wastePercent,
          metrics: {
            points,
            wireLength,
            adjustedWireLength: roundMoney(adjustedWireLength)
          },
          costs: {
            wireCost: roundMoney(wireCost),
            accessoriesCost: roundMoney(accessoriesCost),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          }
        }
      }
      default:
        throw new Error('Estimator not implemented for this service yet.')
    }
  }

  return { calculateEstimate }
}
