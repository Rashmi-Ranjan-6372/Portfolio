import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = {
    name: '',
    category: '',
    proficiency: 'INTERMEDIATE',
    proficiency_percentage: 50,
    icon: '',
    years_of_experience: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
}

const emptyCategoryForm = {
    name: '',
    description: '',
    display_order: 0,
}

const proficiencyOptions = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
    { value: 'EXPERT', label: 'Expert' },
]

function getList(response) {
    const data =
        response.data?.data ??
        response.data?.results ??
        response.data

    return Array.isArray(data) ? data : []
}

function getCategoryId(category) {
    if (category && typeof category === 'object') {
        return String(category.id ?? '')
    }

    return String(category ?? '')
}

function getErrorMessage(err) {
    const data = err.response?.data

    if (data?.errors) {
        return Object.entries(data.errors)
            .map(([field, messages]) => {
                const message = Array.isArray(messages)
                    ? messages.join(', ')
                    : String(messages)

                return `${field}: ${message}`
            })
            .join(' | ')
    }

    if (data?.message) {
        return data.message
    }

    if (data && typeof data === 'object') {
        return Object.entries(data)
            .map(([field, messages]) => {
                const message = Array.isArray(messages)
                    ? messages.join(', ')
                    : String(messages)

                return `${field}: ${message}`
            })
            .join(' | ')
    }

    return 'Something went wrong. Please try again.'
}

function ManageSkills() {
    const [skills, setSkills] = useState([])
    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState(emptyForm)
    const [categoryForm, setCategoryForm] = useState(emptyCategoryForm)

    const [editingId, setEditingId] = useState(null)
    const [editingCategoryId, setEditingCategoryId] = useState(null)

    const [showForm, setShowForm] = useState(false)
    const [showCategoryForm, setShowCategoryForm] = useState(false)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [savingCategory, setSavingCategory] = useState(false)

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const [deleteId, setDeleteId] = useState(null)
    const [deleteCategoryId, setDeleteCategoryId] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [deletingCategory, setDeletingCategory] = useState(false)

    const getSkills = async () => {
        const response = await api.get('skills/')
        setSkills(getList(response))
    }

    const getCategories = async () => {
        const response = await api.get('skills/categories/')
        setCategories(getList(response))
    }

    const loadData = async () => {
        setLoading(true)
        setError('')

        try {
            const results = await Promise.allSettled([
                getSkills(),
                getCategories(),
            ])

            const failed = results.find(
                (result) => result.status === 'rejected'
            )

            if (failed) {
                throw failed.reason
            }
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleCategoryChange = (e) => {
        const { name, value } = e.target

        setCategoryForm((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const openAddForm = () => {
        setEditingId(null)
        setFormData({ ...emptyForm })
        setError('')
        setMessage('')
        setShowForm(true)
    }

    const openEditForm = (skill) => {
        setEditingId(skill.id)

        setFormData({
            name: skill.name ?? '',
            category: getCategoryId(skill.category),
            proficiency: skill.proficiency ?? 'INTERMEDIATE',
            proficiency_percentage:
                skill.proficiency_percentage ?? 50,
            icon: skill.icon ?? '',
            years_of_experience:
                skill.years_of_experience ?? '',
            is_featured: Boolean(skill.is_featured),
            is_active: skill.is_active ?? true,
            display_order: skill.display_order ?? 0,
        })

        setError('')
        setMessage('')
        setShowForm(true)
    }

    const openAddCategoryForm = () => {
        setEditingCategoryId(null)
        setCategoryForm({ ...emptyCategoryForm })
        setError('')
        setMessage('')
        setShowCategoryForm(true)
    }

    const openEditCategoryForm = (category) => {
        setEditingCategoryId(category.id)

        setCategoryForm({
            name: category.name ?? '',
            description: category.description ?? '',
            display_order: category.display_order ?? 0,
        })

        setError('')
        setMessage('')
        setShowCategoryForm(true)
    }

    const handleCategorySubmit = async (e) => {
        e.preventDefault()
        setSavingCategory(true)
        setError('')
        setMessage('')

        const payload = {
            name: categoryForm.name.trim(),
            description: categoryForm.description.trim(),
            display_order: Number(categoryForm.display_order) || 0,
        }

        try {
            if (editingCategoryId !== null) {
                await api.patch(
                    `skills/categories/${editingCategoryId}/`,
                    payload
                )
                setMessage('Skill category updated successfully.')
            } else {
                await api.post('skills/categories/', payload)
                setMessage('Skill category added successfully.')
            }

            setShowCategoryForm(false)
            setCategoryForm({ ...emptyCategoryForm })
            setEditingCategoryId(null)

            await getCategories()
            await getSkills()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setSavingCategory(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setMessage('')

        if (!formData.category) {
            setError('Please select a skill category.')
            setSaving(false)
            return
        }

        const percentage = Number(
            formData.proficiency_percentage
        )

        if (
            !Number.isFinite(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {
            setError(
                'Proficiency percentage must be between 0 and 100.'
            )
            setSaving(false)
            return
        }

        const years =
            formData.years_of_experience === ''
                ? null
                : Number(formData.years_of_experience)

        if (years !== null && (!Number.isFinite(years) || years < 0)) {
            setError('Years of experience must be zero or greater.')
            setSaving(false)
            return
        }

        const payload = {
            name: formData.name.trim(),
            category: Number(formData.category),
            proficiency: formData.proficiency,
            proficiency_percentage: percentage,
            icon: formData.icon.trim() || null,
            years_of_experience: years,
            is_featured: formData.is_featured,
            is_active: formData.is_active,
            display_order: Number(formData.display_order) || 0,
        }

        try {
            if (editingId !== null) {
                await api.patch(`skills/${editingId}/`, payload)
                setMessage('Skill updated successfully.')
            } else {
                await api.post('skills/', payload)
                setMessage('Skill added successfully.')
            }

            setShowForm(false)
            setFormData({ ...emptyForm })
            setEditingId(null)

            await getSkills()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (deleteId === null) return

        setDeleting(true)
        setError('')
        setMessage('')

        try {
            await api.delete(`skills/${deleteId}/`)
            setDeleteId(null)
            setMessage('Skill deleted successfully.')
            await getSkills()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setDeleting(false)
        }
    }

    const handleDeleteCategory = async () => {
        if (deleteCategoryId === null) return

        setDeletingCategory(true)
        setError('')
        setMessage('')

        try {
            await api.delete(
                `skills/categories/${deleteCategoryId}/`
            )

            setDeleteCategoryId(null)
            setMessage('Skill category deleted successfully.')

            await getCategories()
            await getSkills()
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setDeletingCategory(false)
        }
    }

    const getCategoryName = (skill) => {
        if (skill.category_name) {
            return skill.category_name
        }

        if (skill.category && typeof skill.category === 'object') {
            return skill.category.name ?? 'Uncategorized'
        }

        const category = categories.find(
            (item) => String(item.id) === String(skill.category)
        )

        return category?.name ?? 'Uncategorized'
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-cyan-400">
                        PORTFOLIO CONTENT
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Manage Skills
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage skill categories and your technical skills.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={openAddCategoryForm}
                        className="rounded-xl border border-cyan-400/40 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                    >
                        + Add Category
                    </button>

                    <button
                        type="button"
                        onClick={openAddForm}
                        disabled={categories.length === 0}
                        className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        + Add Skill
                    </button>
                </div>
            </div>

            {message && (
                <div
                    role="status"
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="break-words rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                >
                    {error}
                </div>
            )}

            {showCategoryForm && (
                <form
                    onSubmit={handleCategorySubmit}
                    className="space-y-5 rounded-2xl border border-cyan-400/20 bg-white/[0.04] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-semibold text-white">
                        {editingCategoryId !== null
                            ? 'Edit Skill Category'
                            : 'Add Skill Category'}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div>
                            <label
                                htmlFor="category-name"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Category Name
                            </label>

                            <input
                                id="category-name"
                                name="name"
                                value={categoryForm.name}
                                onChange={handleCategoryChange}
                                required
                                maxLength={100}
                                placeholder="Backend Development"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category-description"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Description
                            </label>

                            <input
                                id="category-description"
                                name="description"
                                value={categoryForm.description}
                                onChange={handleCategoryChange}
                                placeholder="Backend programming skills"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category-order"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Display Order
                            </label>

                            <input
                                id="category-order"
                                name="display_order"
                                type="number"
                                min="0"
                                value={categoryForm.display_order}
                                onChange={handleCategoryChange}
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={savingCategory}
                            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
                        >
                            {savingCategory
                                ? 'Saving...'
                                : editingCategoryId !== null
                                    ? 'Update Category'
                                    : 'Save Category'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowCategoryForm(false)}
                            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-semibold text-white">
                        Skill Categories
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({categories.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-6 text-sm text-slate-400">
                        Loading categories...
                    </p>
                ) : categories.length === 0 ? (
                    <p className="p-6 text-sm text-slate-400">
                        No categories found. Click Add Category to create one.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="border-b border-white/10 bg-white/[0.03] text-slate-400">
                                <tr>
                                    <th className="px-5 py-4 font-medium">ID</th>
                                    <th className="px-5 py-4 font-medium">Category Name</th>
                                    <th className="px-5 py-4 font-medium">Description</th>
                                    <th className="px-5 py-4 font-medium">Order</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="transition hover:bg-white/[0.03]"
                                    >
                                        <td className="px-5 py-4 text-slate-400">
                                            {category.id}
                                        </td>

                                        <td className="px-5 py-4 font-medium text-white">
                                            {category.name}
                                        </td>

                                        <td className="max-w-xs px-5 py-4 text-slate-400">
                                            {category.description || 'No description'}
                                        </td>

                                        <td className="px-5 py-4 text-slate-300">
                                            {category.display_order ?? 0}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditCategoryForm(category)
                                                    }
                                                    className="font-medium text-cyan-300 hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleteCategoryId(category.id)
                                                    }
                                                    className="font-medium text-red-400 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                >
                    <h2 className="text-xl font-semibold text-white">
                        {editingId !== null ? 'Edit Skill' : 'Add Skill'}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Skill Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                placeholder="Python"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            >
                                <option value="">Select Category</option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {categories.length === 0 && (
                                <p className="mt-2 text-xs text-amber-300">
                                    Create a category before adding a skill.
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="proficiency"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Proficiency Level
                            </label>

                            <select
                                id="proficiency"
                                name="proficiency"
                                value={formData.proficiency}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            >
                                {proficiencyOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="proficiency_percentage"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Proficiency Percentage
                            </label>

                            <input
                                id="proficiency_percentage"
                                name="proficiency_percentage"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.proficiency_percentage}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="icon"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Icon Name
                            </label>

                            <input
                                id="icon"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                maxLength={100}
                                placeholder="python"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="years_of_experience"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Years of Experience
                            </label>

                            <input
                                id="years_of_experience"
                                name="years_of_experience"
                                type="number"
                                min="0"
                                step="0.1"
                                value={formData.years_of_experience}
                                onChange={handleChange}
                                placeholder="1.5"
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="display_order"
                                className="mb-2 block text-sm text-slate-300"
                            >
                                Display Order
                            </label>

                            <input
                                id="display_order"
                                name="display_order"
                                type="number"
                                min="0"
                                value={formData.display_order}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                className="h-4 w-4 accent-cyan-400"
                            />
                            Featured Skill
                        </label>

                        <label className="flex items-center gap-2 text-sm text-slate-300">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="h-4 w-4 accent-cyan-400"
                            />
                            Active
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving || categories.length === 0}
                            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? 'Saving...'
                                : editingId !== null
                                    ? 'Update Skill'
                                    : 'Save Skill'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-semibold text-white">
                        Skills List
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({skills.length})
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <p className="p-8 text-sm text-slate-400">
                        Loading skills...
                    </p>
                ) : skills.length === 0 ? (
                    <p className="p-8 text-sm text-slate-400">
                        No skills found. Add your first skill.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm">
                            <thead className="border-b border-white/10 bg-white/[0.03] text-slate-400">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Skill Name</th>
                                    <th className="px-5 py-4 font-medium">Category</th>
                                    <th className="px-5 py-4 font-medium">Proficiency</th>
                                    <th className="px-5 py-4 font-medium">Level</th>
                                    <th className="px-5 py-4 font-medium">Experience</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {skills.map((skill) => {
                                    const percentage = Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            Number(skill.proficiency_percentage) || 0
                                        )
                                    )

                                    return (
                                        <tr
                                            key={skill.id}
                                            className="transition hover:bg-white/[0.03]"
                                        >
                                            <td className="px-5 py-4 font-medium text-white">
                                                {skill.name}
                                                {skill.is_featured && (
                                                    <span className="ml-2 text-xs text-amber-300">
                                                        Featured
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-slate-300">
                                                {getCategoryName(skill)}
                                            </td>

                                            <td className="px-5 py-4 text-slate-300">
                                                {proficiencyOptions.find(
                                                    (option) =>
                                                        option.value === skill.proficiency
                                                )?.label ?? skill.proficiency}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                                                        <div
                                                            className="h-full rounded-full bg-cyan-400"
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="font-medium text-cyan-300">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-slate-300">
                                                {skill.years_of_experience !== null &&
                                                    skill.years_of_experience !== undefined &&
                                                    skill.years_of_experience !== ''
                                                    ? `${skill.years_of_experience} years`
                                                    : '—'}
                                            </td>

                                            <td className="px-5 py-4">
                                                {skill.is_active === false ? (
                                                    <span className="text-red-300">
                                                        Inactive
                                                    </span>
                                                ) : (
                                                    <span className="text-emerald-300">
                                                        Active
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(skill)}
                                                        className="font-medium text-cyan-300 hover:underline"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteId(skill.id)}
                                                        className="font-medium text-red-400 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {(deleteId !== null || deleteCategoryId !== null) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-semibold text-white">
                            {deleteCategoryId !== null
                                ? 'Delete Skill Category'
                                : 'Delete Skill'}
                        </h2>

                        <p className="mt-3 text-sm text-slate-400">
                            {deleteCategoryId !== null
                                ? 'Are you sure you want to delete this category? Your Django model uses CASCADE, so deleting a category may also delete its associated skills.'
                                : 'Are you sure you want to delete this skill? This action cannot be undone.'}
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={deleting || deletingCategory}
                                onClick={() => {
                                    setDeleteId(null)
                                    setDeleteCategoryId(null)
                                }}
                                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleting || deletingCategory}
                                onClick={
                                    deleteCategoryId !== null
                                        ? handleDeleteCategory
                                        : handleDelete
                                }
                                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
                            >
                                {deleting || deletingCategory
                                    ? 'Deleting...'
                                    : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageSkills
