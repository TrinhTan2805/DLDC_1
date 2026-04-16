interface ContactInfoSectionProps {
  isEdit?: boolean;
  defaultValues?: any;
}

export function ContactInfoSection({ isEdit = false, defaultValues }: ContactInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600 mb-2">
        Th├┤ng tin ─æ╞ín vß╗ï cung cß║Ñp dß╗» liß╗çu
      </div>
      
      <div>
        <label htmlFor="contact-unit-name" className="block text-sm text-slate-600 mb-1">
          T├¬n ─æ╞ín vß╗ï
        </label>
        <input aria-label="Input field"
          id="contact-unit-name"
          title="T├¬n ─æ╞ín vß╗ï"
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: Cß╗Ñc Hß╗Ö tß╗ïch, quß╗æc tß╗ïch, chß╗⌐ng thß╗▒c"
          defaultValue={defaultValues?.unitName}
        />
      </div>

      <div>
        <label htmlFor="contact-address" className="block text-sm text-slate-600 mb-1">
          ─Éß╗ïa chß╗ë
        </label>
        <input aria-label="Input field"
          id="contact-address"
          title="─Éß╗ïa chß╗ë"
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhß║¡p ─æß╗ïa chß╗ë ─æ╞ín vß╗ï"
          defaultValue={defaultValues?.address}
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm text-slate-600 mb-1">
          Sß╗æ ─æiß╗çn thoß║íi
        </label>
        <input aria-label="Input field"
          id="contact-phone"
          title="Sß╗æ ─æiß╗çn thoß║íi"
          type="tel"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: 024 3733 9999"
          defaultValue={defaultValues?.phone}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm text-slate-600 mb-1">
          ─Éß╗ïa chß╗ë email
        </label>
        <input aria-label="Input field"
          id="contact-email"
          title="─Éß╗ïa chß╗ë email"
          type="email"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example@moj.gov.vn"
          defaultValue={defaultValues?.email}
        />
      </div>

      <div>
        <label htmlFor="technical-contact" className="block text-sm text-slate-600 mb-1">
          Ng╞░ß╗¥i ─æß║ºu mß╗æi k├╜ thuß║¡t
        </label>
        <input aria-label="Input field"
          id="technical-contact"
          title="Ng╞░ß╗¥i ─æß║ºu mß╗æi k├╜ thuß║¡t"
          type="text"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nguyß╗àn V─ân A S─ÉT: 0987654321"
          defaultValue={defaultValues?.technicalContact}
        />
      </div>

      <div>
        <label htmlFor="contact-note" className="block text-sm text-slate-600 mb-1">
          Ghi ch├║
        </label>
        <textarea aria-label="Text input"
          id="contact-note"
          title="Ghi ch├║"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Th├┤ng tin bß╗ò sung vß╗ü ─æ╞ín vß╗ï"
          defaultValue={defaultValues?.note}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          <strong>L╞░u ├╜:</strong> Email n├áy sß║╜ nhß║¡n th├┤ng b├ío khi kß║┐t nß╗æi API th├ánh c├┤ng hoß║╖c c├│ vß║Ñn ─æß╗ü ph├ít sinh.
        </p>
      </div>
    </div>
  );
}
