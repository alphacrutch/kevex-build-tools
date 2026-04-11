import services from '@/config/serviceConfig'

const roundMoney = (value) => Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100
const roundValue = (value, digits = 2) => Number(Number(value || 0).toFixed(digits))

const buildLaborSummary = (units, service) => {
  const hours = roundValue(units * Number(service.laborHoursPerUnit || 0))
  const days = roundValue(hours / 8)

  return {
    hours,
    days,
    rate: roundMoney(service.laborRate || 0)
  }
}

export function useEstimator() {
  const calculateEstimate = (serviceId, form) => {
    const service = services[serviceId]

    if (!service) {
      throw new Error('Invalid service selected.')
    }

    const wastePercent = Number(form.wastePercent ?? service.defaultWaste ?? 0)
    const wasteFactor = 1 + wastePercent / 100
    const markupPercent = Number(form.markupPercent ?? 0)
    const overheadCost = Number(form.overheadCost ?? 0)

    switch (serviceId) {
      case 'tiling': {
        const length = Number(form.length || 0)
        const width = Number(form.width || 0)
        const area = length * width
        const adjustedArea = area * wasteFactor
        const tileBoxes = Number(form.tileCoverage || 0) > 0 ? Math.ceil(adjustedArea / Number(form.tileCoverage || 0)) : 0
        const adhesiveBags =
          Number(form.adhesiveCoverage || 0) > 0 ? Math.ceil(adjustedArea / Number(form.adhesiveCoverage || 0)) : 0
        const groutBags = Number(form.groutCoverage || 0) > 0 ? Math.ceil(adjustedArea / Number(form.groutCoverage || 0)) : 0
        const tileCost = tileBoxes * Number(form.tileBoxPrice || 0)
        const adhesiveCost = adhesiveBags * Number(form.adhesiveBagPrice || 0)
        const groutCost = groutBags * Number(form.groutBagPrice || 0)
        const materialsCost = tileCost + adhesiveCost + groutCost
        const labor = buildLaborSummary(area, service)
        const laborCost = area * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost + overheadCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue
        const profitMargin = total > 0 ? roundValue((markupValue / total) * 100) : 0

        return {
          service: service.title,
          serviceId,
          materialType: form.materialType || 'ceramic',
          wastePercent,
          metrics: {
            dimensions: `${roundValue(length, 1)} ft x ${roundValue(width, 1)} ft`,
            area: roundMoney(area),
            adjustedArea: roundMoney(adjustedArea),
            tileBoxes,
            adhesiveBags,
            groutBags
          },
          materials: [
            { label: 'Tile boxes', quantity: tileBoxes, unit: 'boxes', rate: Number(form.tileBoxPrice || 0), total: roundMoney(tileCost) },
            { label: 'Adhesive bags', quantity: adhesiveBags, unit: 'bags', rate: Number(form.adhesiveBagPrice || 0), total: roundMoney(adhesiveCost) },
            { label: 'Grout bags', quantity: groutBags, unit: 'bags', rate: Number(form.groutBagPrice || 0), total: roundMoney(groutCost) }
          ],
          labor: {
            ...labor,
            total: roundMoney(laborCost)
          },
          costs: {
            tileCost: roundMoney(tileCost),
            adhesiveCost: roundMoney(adhesiveCost),
            groutCost: roundMoney(groutCost),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            overheadCost: roundMoney(overheadCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          },
          profitMargin
        }
      }
      case 'plumbing': {
        const fixtures = Number(form.fixtures || 0)
        const pipeLength = Number(form.pipeLength || 0)
        const adjustedPipeLength = pipeLength * wasteFactor
        const fittingsCount = Number(form.fittingsPerFixture || 0) * fixtures
        const pipeCost = adjustedPipeLength * Number(form.pipeCostPerFt || 0)
        const fittingsCost = fittingsCount * Number(form.fittingUnitCost || 0)
        const materialsCost = pipeCost + fittingsCost
        const labor = buildLaborSummary(fixtures, service)
        const laborCost = fixtures * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost + overheadCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue
        const profitMargin = total > 0 ? roundValue((markupValue / total) * 100) : 0

        return {
          service: service.title,
          serviceId,
          materialType: form.materialType || 'pvc',
          wastePercent,
          metrics: {
            fixtures,
            pipeLength: roundMoney(pipeLength),
            adjustedPipeLength: roundMoney(adjustedPipeLength),
            fittingsCount
          },
          materials: [
            { label: 'Pipe length', quantity: roundValue(adjustedPipeLength), unit: 'ft', rate: Number(form.pipeCostPerFt || 0), total: roundMoney(pipeCost) },
            { label: 'Fittings', quantity: fittingsCount, unit: 'pcs', rate: Number(form.fittingUnitCost || 0), total: roundMoney(fittingsCost) }
          ],
          labor: {
            ...labor,
            total: roundMoney(laborCost)
          },
          costs: {
            pipeCost: roundMoney(pipeCost),
            fittingsCost: roundMoney(fittingsCost),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            overheadCost: roundMoney(overheadCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          },
          profitMargin
        }
      }
      case 'electrical': {
        const points = Number(form.points || 0)
        const wireLength = Number(form.wireLength || 0)
        const adjustedWireLength = wireLength * wasteFactor
        const wireCost = adjustedWireLength * Number(form.wireCostPerFt || 0)
        const accessoriesCost = Number(form.accessoriesCost || 0)
        const breakerAllowance = Number(form.breakerAllowance || 0)
        const materialsCost = wireCost + accessoriesCost + breakerAllowance
        const labor = buildLaborSummary(points, service)
        const laborCost = points * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost + overheadCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue
        const profitMargin = total > 0 ? roundValue((markupValue / total) * 100) : 0

        return {
          service: service.title,
          serviceId,
          materialType: form.materialType || 'thhn',
          wastePercent,
          metrics: {
            points,
            wireLength: roundMoney(wireLength),
            adjustedWireLength: roundMoney(adjustedWireLength)
          },
          materials: [
            { label: 'Wire length', quantity: roundValue(adjustedWireLength), unit: 'ft', rate: Number(form.wireCostPerFt || 0), total: roundMoney(wireCost) },
            { label: 'Accessories', quantity: 1, unit: 'lot', rate: accessoriesCost, total: roundMoney(accessoriesCost) },
            { label: 'Breaker allowance', quantity: 1, unit: 'lot', rate: breakerAllowance, total: roundMoney(breakerAllowance) }
          ],
          labor: {
            ...labor,
            total: roundMoney(laborCost)
          },
          costs: {
            wireCost: roundMoney(wireCost),
            accessoriesCost: roundMoney(accessoriesCost),
            breakerAllowance: roundMoney(breakerAllowance),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            overheadCost: roundMoney(overheadCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          },
          profitMargin
        }
      }
      case 'painting': {
        const length = Number(form.length || 0)
        const width = Number(form.width || 0)
        const height = Number(form.height || 0)
        const coats = Number(form.coats || 1)
        const perimeter = (length + width) * 2
        const wallArea = perimeter * height
        const adjustedArea = wallArea * wasteFactor
        const paintGallons = Number(form.paintCoverage || 0) > 0 ? Math.ceil((adjustedArea * coats) / Number(form.paintCoverage || 0)) : 0
        const primerGallons =
          Number(form.primerCoverage || 0) > 0 ? Math.ceil(adjustedArea / Number(form.primerCoverage || 0)) : 0
        const paintCost = paintGallons * Number(form.paintUnitPrice || 0)
        const primerCost = primerGallons * Number(form.primerUnitPrice || 0)
        const materialsCost = paintCost + primerCost
        const labor = buildLaborSummary(adjustedArea, service)
        const laborCost = adjustedArea * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost + overheadCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue
        const profitMargin = total > 0 ? roundValue((markupValue / total) * 100) : 0

        return {
          service: service.title,
          serviceId,
          materialType: form.materialType || 'standard',
          wastePercent,
          metrics: {
            wallArea: roundMoney(wallArea),
            adjustedArea: roundMoney(adjustedArea),
            coats,
            paintGallons,
            primerGallons
          },
          materials: [
            { label: 'Paint gallons', quantity: paintGallons, unit: 'gallons', rate: Number(form.paintUnitPrice || 0), total: roundMoney(paintCost) },
            { label: 'Primer gallons', quantity: primerGallons, unit: 'gallons', rate: Number(form.primerUnitPrice || 0), total: roundMoney(primerCost) }
          ],
          labor: {
            ...labor,
            total: roundMoney(laborCost)
          },
          costs: {
            paintCost: roundMoney(paintCost),
            primerCost: roundMoney(primerCost),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            overheadCost: roundMoney(overheadCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          },
          profitMargin
        }
      }
      case 'concrete': {
        const length = Number(form.length || 0)
        const width = Number(form.width || 0)
        const depthFeet = Number(form.depth || 0) / 12
        const volume = length * width * depthFeet
        const adjustedVolume = volume * wasteFactor
        const bagCount = Number(form.yieldPerBag || 0) > 0 ? Math.ceil(adjustedVolume / Number(form.yieldPerBag || 0)) : 0
        const bagCost = bagCount * Number(form.bagPrice || 0)
        const rebarCost = Number(form.rebarCost || 0)
        const materialsCost = bagCost + rebarCost
        const labor = buildLaborSummary(adjustedVolume, service)
        const laborCost = adjustedVolume * Number(service.laborRate || 0)
        const subtotal = materialsCost + laborCost + overheadCost
        const markupValue = subtotal * (markupPercent / 100)
        const total = subtotal + markupValue
        const profitMargin = total > 0 ? roundValue((markupValue / total) * 100) : 0

        return {
          service: service.title,
          serviceId,
          materialType: form.materialType || 'ready-mix',
          wastePercent,
          metrics: {
            volume: roundMoney(volume),
            adjustedVolume: roundMoney(adjustedVolume),
            bagCount
          },
          materials: [
            { label: 'Concrete bags', quantity: bagCount, unit: 'bags', rate: Number(form.bagPrice || 0), total: roundMoney(bagCost) },
            { label: 'Rebar / mesh', quantity: 1, unit: 'lot', rate: rebarCost, total: roundMoney(rebarCost) }
          ],
          labor: {
            ...labor,
            total: roundMoney(laborCost)
          },
          costs: {
            bagCost: roundMoney(bagCost),
            rebarCost: roundMoney(rebarCost),
            materialsCost: roundMoney(materialsCost),
            laborCost: roundMoney(laborCost),
            overheadCost: roundMoney(overheadCost),
            markupValue: roundMoney(markupValue),
            total: roundMoney(total)
          },
          profitMargin
        }
      }
      default:
        throw new Error('Estimator not implemented for this service yet.')
    }
  }

  return { calculateEstimate }
}
