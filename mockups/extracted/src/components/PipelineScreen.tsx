import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../stores/store';
import { Candidature, CandidatureStatut, CanalType } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUTS: CandidatureStatut[] = [
  'À contacter',
  'Contacté',
  'Réponse positive',
  'Réponse négative',
  'À relancer',
];

const COLUMN_CONFIG = [
  {
    statut: 'À contacter' as CandidatureStatut,
    dot:    'bg-slate-400',
    bg:     'bg-slate-50 dark:bg-slate-900/40',
    border: 'border-slate-200 dark:border-slate-700',
    badge:  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  },
  {
    statut: 'Contacté' as CandidatureStatut,
    dot:    'bg-blue-500',
    bg:     'bg-blue-50/40 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-800',
    badge:  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    statut: 'Réponse positive' as CandidatureStatut,
    dot:    'bg-emerald-500',
    bg:     'bg-emerald-50/40 dark:bg-emerald-900/10',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge:  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  },
  {
    statut: 'Réponse négative' as CandidatureStatut,
    dot:    'bg-red-400',
    bg:     'bg-red-50/40 dark:bg-red-900/10',
    border: 'border-red-200 dark:border-red-800',
    badge:  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
  {
    statut: 'À relancer' as CandidatureStatut,
    dot:    'bg-amber-500',
    bg:     'bg-amber-50/40 dark:bg-amber-900/10',
    border: 'border-amber-200 dark:border-amber-800',
    badge:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  },
] as const;

const STATUT_STYLE: Record<CandidatureStatut, string> = {
  'À contacter':    'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  'Contacté':       'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Réponse positive': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  'Réponse négative': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'À relancer':     'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
};

const CANAL_CONFIG: Record<CanalType, { Icon: React.ComponentType<{ className?: string }>; color: string }> = {
  LinkedIn:   { Icon: Icons.Linkedin, color: 'text-blue-600 dark:text-blue-400' },
  Email:      { Icon: Icons.Mail,     color: 'text-slate-500 dark:text-slate-400' },
  Téléphone: { Icon: Icons.Phone,    color: 'text-emerald-600 dark:text-emerald-400' },
};

const LOGO_COLORS = [
  'bg-rose-400', 'bg-teal-400', 'bg-sky-500', 'bg-green-400',
  'bg-amber-400', 'bg-purple-400', 'bg-cyan-500', 'bg-orange-400',
  'bg-pink-400',  'bg-indigo-400',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function logoInfo(name: string) {
  return {
    initial:  name.charAt(0).toUpperCase() || '?',
    bgColor:  LOGO_COLORS[name.charCodeAt(0) % LOGO_COLORS.length],
  };
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function isOverdue(c: Candidature): boolean {
  return !!c.dateRelancePrevue && c.dateRelancePrevue <= todayISO();
}

function matchesRelancerFilter(c: Candidature): boolean {
  return c.statut === 'À relancer' || isOverdue(c);
}

// ─── KanbanCard ───────────────────────────────────────────────────────────────

interface KanbanCardProps {
  candidature: Candidature;
  dragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onClick: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ candidature: c, dragging, onDragStart, onDragEnd, onClick }) => {
  const { initial, bgColor } = logoInfo(c.entreprise);
  const { Icon: CanalIcon, color: canalColor } = CANAL_CONFIG[c.canal];
  const overdue = isOverdue(c);

  // Fallback title: posteVise > contactRole > entreprise
  const cardTitle = c.posteVise || c.contactRole || c.entreprise;
  // If the title IS the contact's role, don't repeat it on the contact line
  const titleIsContactRole = !c.posteVise && !!c.contactRole;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div
        draggable
        onClick={onClick}
        onDragStart={(e) => { onDragStart(c.id); e.dataTransfer.effectAllowed = 'move'; }}
        onDragEnd={onDragEnd}
        className={`
          bg-white dark:bg-slate-800 rounded-xl p-3.5
          border border-slate-200 dark:border-slate-700
          ${overdue ? 'border-l-2 !border-l-amber-400' : ''}
          shadow-sm cursor-grab active:cursor-grabbing
          hover:shadow-md hover:-translate-y-0.5 transition-all
          ${dragging ? 'opacity-40' : ''}
        `}
      >
        {/* Header: logo + poste + entreprise */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-[11px]">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate leading-snug">
              {cardTitle}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{c.entreprise}</p>
          </div>
        </div>

        {/* Contact */}
        {c.contactNom && (
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1 truncate">
            <Icons.User className="w-3 h-3 flex-shrink-0 text-slate-400" />
            {c.contactNom}{!titleIsContactRole && c.contactRole && ` · ${c.contactRole}`}
          </p>
        )}

        {/* Footer: canal + date */}
        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-1 ${canalColor}`}>
            <CanalIcon className="w-3 h-3" />
            <span className="text-[10px] font-medium">{c.canal}</span>
          </span>
          {c.dateDernierContact && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
              <Icons.Clock className="w-3 h-3" />
              {fmtDate(c.dateDernierContact)}
            </span>
          )}
        </div>

        {/* Overdue badge */}
        {overdue && (
          <div className="mt-2 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-medium flex items-center gap-1 w-fit">
            <Icons.AlertCircle className="w-3 h-3" />
            Relance en retard
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── KanbanColumn ─────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  config: (typeof COLUMN_CONFIG)[number];
  cards: Candidature[];
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string, statut: CandidatureStatut) => void;
  onCardClick: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  config, cards, draggedId, onDragStart, onDragEnd, onDrop, onCardClick,
}) => {
  const [over, setOver] = useState(false);

  return (
    <div className="flex-1 min-w-[240px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5 px-0.5">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot}`} />
        <h3 className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 flex-1 leading-tight">
          {config.statut}
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${config.badge}`}>
          {cards.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className={`
          flex-1 rounded-2xl border ${config.border} ${config.bg} p-2.5 space-y-2.5 min-h-[380px]
          transition-all duration-150
          ${over ? 'ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-slate-900' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (draggedId) onDrop(draggedId, config.statut); }}
      >
        <AnimatePresence mode="popLayout">
          {cards.map((c) => (
            <KanbanCard
              key={c.id}
              candidature={c}
              dragging={draggedId === c.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={() => onCardClick(c.id)}
            />
          ))}
        </AnimatePresence>
        {cards.length === 0 && (
          <div className="flex items-center justify-center h-16 text-[11px] text-slate-400 dark:text-slate-600 select-none">
            Glisser ici
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TableView ────────────────────────────────────────────────────────────────

type SortKey = 'entreprise' | 'contactNom' | 'posteVise' | 'canal' | 'statut' | 'dateDernierContact' | 'dateRelancePrevue';

const TABLE_COLS: Array<{ key: SortKey | null; label: string; width?: string }> = [
  { key: 'entreprise',          label: 'Entreprise',       width: 'w-[160px]' },
  { key: 'contactNom',          label: 'Contact',          width: 'w-[150px]' },
  { key: null,                  label: 'Rôle',             width: 'w-[130px]' },
  { key: 'posteVise',           label: 'Poste',            width: 'w-[180px]' },
  { key: 'canal',               label: 'Canal',            width: 'w-[100px]' },
  { key: 'statut',              label: 'Statut',           width: 'w-[150px]' },
  { key: 'dateDernierContact',  label: 'Dernier contact',  width: 'w-[140px]' },
  { key: 'dateRelancePrevue',   label: 'Relance prévue',   width: 'w-[140px]' },
  { key: null,                  label: 'Notes',            width: 'w-[180px]' },
];

const TableView: React.FC<{ candidatures: Candidature[] }> = ({ candidatures }) => {
  const { updateCandidature, deleteCandidature } = useStore();
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'entreprise', dir: 'asc' });

  const sorted = useMemo(() => {
    return [...candidatures].sort((a, b) => {
      const av = (a[sort.key] ?? '') as string;
      const bv = (b[sort.key] ?? '') as string;
      const cmp = av.localeCompare(bv, 'fr');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [candidatures, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((prev) => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead className="sticky top-0 z-10 bg-white dark:bg-slate-800">
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {TABLE_COLS.map((col) => (
              <th
                key={col.label}
                onClick={() => col.key && toggleSort(col.key)}
                className={`px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap
                  ${col.key ? 'cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none' : ''}
                  ${col.width ?? ''}
                `}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.key && (
                    sort.key === col.key
                      ? sort.dir === 'asc'
                        ? <Icons.ChevronUp className="w-3 h-3" />
                        : <Icons.ChevronDown className="w-3 h-3" />
                      : <Icons.ChevronsUpDown className="w-3 h-3 opacity-30" />
                  )}
                </span>
              </th>
            ))}
            <th className="px-3 py-2.5 w-[40px]" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => {
            const { initial, bgColor } = logoInfo(c.entreprise);
            const { Icon: CanalIcon, color: canalColor } = CANAL_CONFIG[c.canal];
            const overdue = isOverdue(c);

            return (
              <tr
                key={c.id}
                className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors
                  ${overdue ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}
                `}
              >
                {/* Entreprise */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-[10px]">{initial}</span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap truncate max-w-[120px]">
                      {c.entreprise}
                    </span>
                  </div>
                </td>
                {/* Contact nom */}
                <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {c.contactNom || <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                {/* Rôle */}
                <td className="px-3 py-2.5 text-[12px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {c.contactRole || <span className="text-slate-300 dark:text-slate-600">—</span>}
                </td>
                {/* Poste */}
                <td className="px-3 py-2.5 text-slate-800 dark:text-slate-200 max-w-[180px]">
                  <span className="block truncate">{c.posteVise}</span>
                </td>
                {/* Canal */}
                <td className="px-3 py-2.5">
                  <span className={`flex items-center gap-1.5 ${canalColor}`}>
                    <CanalIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[12px] whitespace-nowrap">{c.canal}</span>
                  </span>
                </td>
                {/* Statut — editable */}
                <td className="px-3 py-2">
                  <select
                    value={c.statut}
                    onChange={(e) => updateCandidature(c.id, { statut: e.target.value as CandidatureStatut })}
                    className={`text-[12px] font-medium px-2 py-1 rounded-lg border-0 cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-indigo-400
                      ${STATUT_STYLE[c.statut]}
                    `}
                  >
                    {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                {/* Dernier contact — editable */}
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={c.dateDernierContact ?? ''}
                    onChange={(e) => updateCandidature(c.id, { dateDernierContact: e.target.value || null })}
                    className="text-[12px] text-slate-700 dark:text-slate-300 bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer w-full"
                  />
                </td>
                {/* Relance prévue — editable */}
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={c.dateRelancePrevue ?? ''}
                    onChange={(e) => updateCandidature(c.id, { dateRelancePrevue: e.target.value || null })}
                    className={`text-[12px] bg-transparent border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer w-full
                      ${overdue
                        ? 'border-amber-400 text-amber-700 dark:text-amber-400 dark:border-amber-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }
                    `}
                  />
                </td>
                {/* Notes */}
                <td className="px-3 py-2.5 max-w-[180px]">
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 block truncate">
                    {c.notes || <span className="text-slate-300 dark:text-slate-600">—</span>}
                  </span>
                </td>
                {/* Delete */}
                <td className="px-2 py-2.5">
                  <button
                    onClick={() => { deleteCandidature(c.id); toast.success('Candidature supprimée'); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Icons.Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
          <Icons.Inbox className="w-10 h-10 mb-3" />
          <p className="text-[13px]">Aucune candidature</p>
        </div>
      )}
    </div>
  );
};

// ─── AddCandidatureModal ──────────────────────────────────────────────────────

const EMPTY_FORM = {
  prenom:      '',
  nom:         '',
  contactRole: '',
  entreprise:  '',
  posteVise:   '',
  canal:       'LinkedIn' as CanalType,
  notes:       '',
};

const AddCandidatureModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addCandidature } = useStore();
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (k: keyof typeof EMPTY_FORM, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.prenom.trim() || !form.nom.trim()) {
      toast.error('Le prénom et le nom du contact sont obligatoires');
      return;
    }
    if (!form.entreprise.trim()) {
      toast.error("L'entreprise est obligatoire");
      return;
    }
    addCandidature({
      entreprise:         form.entreprise.trim(),
      contactNom:         `${form.prenom.trim()} ${form.nom.trim()}`,
      contactRole:        form.contactRole.trim(),
      posteVise:          form.posteVise.trim(),
      canal:              form.canal,
      statut:             'À contacter',
      dateDernierContact: null,
      dateRelancePrevue:  null,
      notes:              form.notes.trim(),
    });
    toast.success('Contact ajouté !');
    setForm(EMPTY_FORM);
    onClose();
  };

  const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-['Fraunces'] text-[20px] font-semibold text-slate-900 dark:text-white">
                  Ajouter un contact
                </h2>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Créé en statut "À contacter"</p>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Icons.X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Entreprise */}
              <Field label="Entreprise" required>
                <input value={form.entreprise} onChange={(e) => set('entreprise', e.target.value)}
                  placeholder="NordProd Films" className={inputCls} autoFocus />
              </Field>

              {/* Prénom + Nom */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom" required>
                  <input value={form.prenom} onChange={(e) => set('prenom', e.target.value)}
                    placeholder="Marie" className={inputCls} />
                </Field>
                <Field label="Nom" required>
                  <input value={form.nom} onChange={(e) => set('nom', e.target.value)}
                    placeholder="Dupont" className={inputCls} />
                </Field>
              </div>

              {/* Rôle + Poste */}
              <Field label="Rôle / Poste du contact">
                <input value={form.contactRole} onChange={(e) => set('contactRole', e.target.value)}
                  placeholder="Responsable RH, Directeur de la photo…" className={inputCls} />
              </Field>
              <Field label="Poste visé (ce que tu cherches)">
                <input value={form.posteVise} onChange={(e) => set('posteVise', e.target.value)}
                  placeholder="Alternance en production audiovisuelle" className={inputCls} />
              </Field>

              {/* Canal */}
              <Field label="Canal">
                <div className="flex gap-2">
                  {(['LinkedIn', 'Email', 'Téléphone'] as CanalType[]).map((c) => (
                    <button key={c} type="button"
                      onClick={() => set('canal', c)}
                      className={`flex-1 py-2 rounded-xl text-[12px] font-medium border transition-all ${
                        form.canal === c
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Notes */}
              <Field label="Notes libres">
                <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
                  placeholder="Infos utiles, contexte…" rows={2}
                  className={`${inputCls} resize-none`} />
              </Field>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Créer la candidature
              </button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── DetailPanel ──────────────────────────────────────────────────────────────

const DetailPanel: React.FC<{ candidature: Candidature; onClose: () => void }> = ({ candidature: c, onClose }) => {
  const { updateCandidature, deleteCandidature } = useStore();
  const [notes, setNotes] = useState(c.notes);
  const { initial, bgColor } = logoInfo(c.entreprise);

  const handleDelete = () => {
    deleteCandidature(c.id);
    toast.success('Candidature supprimée');
    onClose();
  };

  return (
    <motion.div
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed top-0 right-0 w-[420px] h-full bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Icons.X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[12px] font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Supprimer
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shadow`}>
            <span className="text-white font-bold text-[18px]">{initial}</span>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white leading-snug">{c.posteVise || c.contactRole || c.entreprise}</h2>
            <p className="text-[13px] text-slate-500 dark:text-slate-400">{c.entreprise}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Statut */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Statut</p>
          <select
            value={c.statut}
            onChange={(e) => updateCandidature(c.id, { statut: e.target.value as CandidatureStatut })}
            className={`text-[13px] font-medium px-3 py-2 rounded-xl border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full ${STATUT_STYLE[c.statut]}`}
          >
            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Infos */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Contact', value: c.contactNom || '—' },
            { label: 'Rôle', value: c.contactRole || '—' },
            { label: 'Canal', value: c.canal },
            { label: 'Créé le', value: fmtDate(c.createdAt.split('T')[0]) },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
              <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200">{value}</p>
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Dernier contact
            </label>
            <input
              type="date"
              value={c.dateDernierContact ?? ''}
              onChange={(e) => updateCandidature(c.id, { dateDernierContact: e.target.value || null })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Relance prévue
            </label>
            <input
              type="date"
              value={c.dateRelancePrevue ?? ''}
              onChange={(e) => updateCandidature(c.id, { dateRelancePrevue: e.target.value || null })}
              className={`w-full px-3 py-2 rounded-xl border text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${isOverdue(c)
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white'
                }
              `}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => updateCandidature(c.id, { notes })}
            rows={5}
            placeholder="Tes notes..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-[13px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── PipelineScreen ───────────────────────────────────────────────────────────

export default function PipelineScreen() {
  const {
    navigateTo, candidatures, currentUser, currentScreen,
    isDarkMode, toggleDarkMode, openModal,
  } = useStore();

  const [view,           setView]           = useState<'kanban' | 'table'>('kanban');
  const [filterRelancer, setFilterRelancer] = useState(false);
  const [draggedId,      setDraggedId]      = useState<string | null>(null);
  const [isAddOpen,      setIsAddOpen]      = useState(false);
  const [selectedId,     setSelectedId]     = useState<string | null>(null);

  const { updateCandidature } = useStore();

  const allCards = Object.values(candidatures);

  const displayed = useMemo(
    () => filterRelancer ? allCards.filter(matchesRelancerFilter) : allCards,
    [allCards, filterRelancer]
  );

  const relancerCount = useMemo(() => allCards.filter(matchesRelancerFilter).length, [allCards]);

  const byStatut = useMemo(() => {
    const map = Object.fromEntries(STATUTS.map((s) => [s, [] as Candidature[]])) as Record<CandidatureStatut, Candidature[]>;
    displayed.forEach((c) => map[c.statut].push(c));
    return map;
  }, [displayed]);

  const handleDrop = (id: string, statut: CandidatureStatut) => {
    updateCandidature(id, { statut });
    setDraggedId(null);
  };

  const selectedCard = selectedId ? candidatures[selectedId] : null;

  return (
    <div className="w-full h-full flex font-['Plus_Jakarta_Sans'] bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`, backgroundSize: '24px 24px' }}
      />

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="w-[72px] h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-6 z-20 flex-shrink-0 transition-colors duration-300">
        <motion.div
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('dashboard')}
          className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-200 dark:shadow-none cursor-pointer"
        >
          <Icons.Zap className="w-5 h-5 text-white" />
        </motion.div>

        <nav className="flex flex-col gap-2">
          {[
            { screen: 'dashboard'        as const, Icon: Icons.LayoutDashboard },
            { screen: 'pipeline'         as const, Icon: Icons.Kanban          },
            { screen: 'contacts'         as const, Icon: Icons.Users           },
            { screen: 'messageGenerator' as const, Icon: Icons.MessageSquare  },
          ].map(({ screen, Icon }) => (
            <motion.button
              key={screen}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo(screen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                currentScreen === screen
                  ? 'bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${currentScreen === screen ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </motion.button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDarkMode ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200'
            }`}
          >
            {isDarkMode
              ? <Icons.Sun className="w-5 h-5 text-white" />
              : <Icons.Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            }
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('profile')}
            title="Mon profil"
            className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center shadow-md"
          >
            <span className="text-[13px] font-bold text-white">
              {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
            </span>
          </motion.button>
          {currentUser?.subscriptionTier === 'free' && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }} whileTap={{ scale: 0.95 }}
              onClick={() => openModal('upgrade')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
            >
              <Icons.Crown className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col p-8 z-10 overflow-hidden">
        {/* TopBar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-5 flex-shrink-0"
        >
          <div>
            <h1 className="font-['Fraunces'] text-[28px] font-semibold text-slate-900 dark:text-white leading-tight">
              Pipeline
            </h1>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-0.5">
              {allCards.length} candidature{allCards.length !== 1 ? 's' : ''}
              {filterRelancer && ` · ${displayed.length} affichée${displayed.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* À relancer filter */}
            <button
              onClick={() => setFilterRelancer((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium border transition-all ${
                filterRelancer
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200/50 dark:shadow-none'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              <Icons.Bell className="w-4 h-4" />
              À relancer
              {relancerCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filterRelancer ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {relancerCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-0.5">
              {([
                { v: 'kanban' as const, Icon: Icons.Kanban, label: 'Kanban' },
                { v: 'table'  as const, Icon: Icons.Table2, label: 'Tableau' },
              ] as const).map(({ v, Icon, label }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                    view === v
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Add button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-[13px] font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <Icons.Plus className="w-4 h-4" />
              Ajouter un contact
            </motion.button>
          </div>
        </motion.div>

        {/* Filter banner */}
        <AnimatePresence>
          {filterRelancer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4 text-[13px] text-amber-700 dark:text-amber-300 flex-shrink-0 overflow-hidden"
            >
              <Icons.Filter className="w-4 h-4 flex-shrink-0" />
              <span>Filtre actif : statut "À relancer" ou date de relance dépassée</span>
              <button onClick={() => setFilterRelancer(false)} className="ml-auto hover:text-amber-900 dark:hover:text-amber-100 transition-colors">
                <Icons.X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Kanban view ── */}
        {view === 'kanban' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.05 }}
            className="flex gap-3 flex-1 min-h-0 overflow-x-auto pb-2"
          >
            {COLUMN_CONFIG.map((col) => (
              <KanbanColumn
                key={col.statut}
                config={col}
                cards={byStatut[col.statut]}
                draggedId={draggedId}
                onDragStart={setDraggedId}
                onDragEnd={() => setDraggedId(null)}
                onDrop={handleDrop}
                onCardClick={setSelectedId}
              />
            ))}
          </motion.div>
        )}

        {/* ── Table view ── */}
        {view === 'table' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.05 }}
            className="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            <TableView candidatures={displayed} />
          </motion.div>
        )}
      </main>

      {/* ── Modals / Panels ─────────────────────────────────────────────── */}
      <AddCandidatureModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <AnimatePresence>
        {selectedCard && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedId(null)}
            />
            <DetailPanel
              key={selectedCard.id}
              candidature={selectedCard}
              onClose={() => setSelectedId(null)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-500 opacity-[0.03] rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" />
    </div>
  );
}
