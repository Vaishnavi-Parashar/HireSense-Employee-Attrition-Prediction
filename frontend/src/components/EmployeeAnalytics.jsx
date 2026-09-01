import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function EmployeeAnalytics() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(15);
  const [search, setSearch] = useState('');
  const [attritionFilter, setAttritionFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const url = `/api/employees?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&attrition=${attritionFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.employees) {
        setEmployees(data.employees);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search, attritionFilter]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card-hs" style={{ borderLeft: '4px solid var(--violet)', background: 'var(--gradient-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--gradient-btn)', color: '#fff' }}>
            <Users size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-deep-purple)' }}>
              Workforce Employee Analytics Directory
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Browse and inspect all 100,000 real dataset employee records.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card-hs" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by ID, income, age..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.25rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Attrition Filter */}
          <select
            value={attritionFilter}
            onChange={(e) => { setAttritionFilter(e.target.value); setPage(1); }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              color: 'var(--text-main)'
            }}
          >
            <option value="">All Attrition Statuses</option>
            <option value="Yes">Attrition (Yes)</option>
            <option value="No">Retained (No)</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing {employees.length} of {total.toLocaleString()} records
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="card-hs">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="animate-spin" style={{ marginBottom: '0.5rem', color: 'var(--violet)' }} />
            <p>Loading dataset records...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>ID</th>
                  <th style={{ padding: '0.75rem' }}>Age</th>
                  <th style={{ padding: '0.75rem' }}>Job Level</th>
                  <th style={{ padding: '0.75rem' }}>Monthly Income</th>
                  <th style={{ padding: '0.75rem' }}>Years at Company</th>
                  <th style={{ padding: '0.75rem' }}>Stock Option</th>
                  <th style={{ padding: '0.75rem' }}>Distance</th>
                  <th style={{ padding: '0.75rem' }}>OverTime</th>
                  <th style={{ padding: '0.75rem' }}>Satisfaction</th>
                  <th style={{ padding: '0.75rem' }}>Attrition Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--violet)' }}>{emp.emp_id}</td>
                    <td style={{ padding: '0.75rem' }}>{emp.Age}</td>
                    <td style={{ padding: '0.75rem' }}>Level {emp.JobLevel}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>${emp.MonthlyIncome?.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem' }}>{emp.YearsAtCompany} yrs</td>
                    <td style={{ padding: '0.75rem' }}>Tier {emp.StockOptionLevel}</td>
                    <td style={{ padding: '0.75rem' }}>{emp.DistanceFromHome} mi</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: emp.OverTime === 'Yes' ? '#FFE4E6' : '#E0E7FF',
                        color: emp.OverTime === 'Yes' ? '#E11D48' : '#3730A3'
                      }}>
                        {emp.OverTime}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{emp.JobSatisfaction} / 4</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: emp.Attrition === 'Yes' ? 'var(--coral)' : '#059669' }}>
                      {emp.Attrition === 'Yes' ? 'Attrition' : 'Retained'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn-secondary"
            style={{ fontSize: '0.8125rem', padding: '0.4rem 0.8rem' }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-deep-purple)' }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="btn-secondary"
            style={{ fontSize: '0.8125rem', padding: '0.4rem 0.8rem' }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
