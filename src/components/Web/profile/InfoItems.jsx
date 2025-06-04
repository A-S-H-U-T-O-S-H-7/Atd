const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-200">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
        <p className="text-slate-800 font-medium break-words">{value || 'Not provided'}</p>
      </div>
    </div>
  );
  
  export default InfoItem;