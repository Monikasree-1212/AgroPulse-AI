function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 truncate">{value || '-'}</p>
      </div>
    </div>
  )
}

export default function PersonalInfoCard({ user }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <span className="text-xl"></span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Personal Information</h3>
          <p className="text-xs text-gray-400 mt-0.5">Your account details</p>
        </div>
      </div>
      <div className="px-6 py-2">
        <InfoRow icon="Farming" label="Full Name"   value={user?.name} />
        <InfoRow icon="" label="Phone Number" value={user?.phone ? `+91 ${user.phone}` : null} />
        <InfoRow icon="" label="Role"         value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null} />
        <InfoRow icon="Calendar" label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' }) : null} />
        <InfoRow icon="" label="Last Login"   value={user?.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'First session'} />
      </div>
    </div>
  )
}
