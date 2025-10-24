import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ImageCard } from './ImageCard'

describe('ImageCard', () => {
    const defaultProps = {
        url: '/fake/path/uuid.jpg',
        size: 'md' as const,
        isSelected: false,
        mode: 'disabled' as const,
        onSelect: vi.fn(),
        onOpen: vi.fn(),
    }

    beforeEach(() => vi.clearAllMocks())

    it('renders the image with the correct src', () => {
        render(<ImageCard url="test.jpg" size="md" isSelected={false} />)

        const img = screen.getByAltText('test.jpg') as HTMLImageElement

        expect(img).toBeInTheDocument()
        expect(img.src).toContain('test.jpg')
    })

    it('does not call onSelect or onOpen when mode is disabled', () => {
        render(<ImageCard {...defaultProps} />)

        const card = screen.getByRole('link')

        fireEvent.click(card)

        expect(defaultProps.onSelect).not.toHaveBeenCalled()
        expect(defaultProps.onOpen).not.toHaveBeenCalled()
    })

    it('calls onSelect when mode is select', () => {
        const props = { ...defaultProps, mode: 'select' as const }

        render(<ImageCard {...props} />)

        const card = screen.getByRole('link')

        fireEvent.click(card)

        expect(props.onSelect).toHaveBeenCalledWith(props.url)
        expect(props.onOpen).not.toHaveBeenCalled()
    })

    it('calls onOpen when mode is open', () => {
        const props = { ...defaultProps, mode: 'open' as const }

        render(<ImageCard {...props} />)

        const card = screen.getByRole('link')

        fireEvent.click(card)

        expect(props.onOpen).toHaveBeenCalledWith(props.url)
        expect(props.onSelect).not.toHaveBeenCalled()
    })

    it('shows the check icon when isSelected is true', () => {
        const props = {
            ...defaultProps,
            isSelected: true,
            mode: 'select' as const,
        }
        render(<ImageCard {...props} />)

        const icon = screen.getByTestId(`image-card-selected-icon-${props.url}`)

        expect(icon).toBeInTheDocument()
        expect(icon).toBeVisible()
    })

    it('hides the check icon when isSelected is false', () => {
        const props = {
            ...defaultProps,
            isSelected: false,
            mode: 'select' as const,
        }
        render(<ImageCard {...props} />)

        const icon = screen.queryByTestId(
            `image-card-selected-icon-${props.url}`,
        )

        expect(icon).not.toBeInTheDocument()
    })

    it('adds ring when mode is select and selected', () => {
        const props = {
            ...defaultProps,
            isSelected: true,
            mode: 'select' as const,
        }
        render(<ImageCard {...props} />)

        const link = screen.getByRole('link')

        expect(link.className).toContain('ring-4')
        expect(link.className).toContain('ring-blue-500/75')
    })

    it('does not have ring when mode is select and not selected', () => {
        const props = {
            ...defaultProps,
            isSelected: false,
            mode: 'select' as const,
        }
        render(<ImageCard {...props} />)

        const link = screen.getByRole('link')

        const baseClasses = link.className
            .split(' ')
            .filter((c) => !c.startsWith('hover:'))

        expect(baseClasses).not.toContain('ring-4')
        expect(baseClasses).not.toContain('ring-blue-500/75')
    })

    it('adds hover ring when mode is open', () => {
        const props = {
            ...defaultProps,
            mode: 'open' as const,
        }
        render(<ImageCard {...props} />)

        const link = screen.getByRole('link')

        expect(link.className).toContain('hover:ring-4')
        expect(link.className).toContain('hover:ring-blue-500/75')
    })

    it('adds hover ring when mode is select and is not selected', () => {
        const props = {
            ...defaultProps,
            isSelected: false,
            mode: 'select' as const,
        }
        render(<ImageCard {...props} />)

        const link = screen.getByRole('link')

        expect(link.className).toContain('hover:ring-4')
        expect(link.className).toContain('hover:ring-blue-500/75')
    })
})
