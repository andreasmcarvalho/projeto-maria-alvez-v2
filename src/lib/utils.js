import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
}

export function formatPhoneNumber(phone) {
  phone = phone.replace(/\D/g, "");
  if (phone.length === 11) {
    phone = phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (phone.length === 10) {
    phone = phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}

export function formatCEP(cep) {
  cep = cep.replace(/\D/g, "");
  cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
  return cep;
}

export async function validateCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  try {
    const response = await fetch(`https://api.brasilaberto.com/v1/cpf/${cpf}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.status === "OK"; // A API brasilaberto retorna status OK para CPF válido
    }
    return false; // Se a API falhar, consideramos inválido por precaução
  } catch (error) {
    console.error("Erro ao validar CPF:", error);
    return false; // Em caso de erro de rede, etc.
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function validateRequiredFields(data, fields) {
  const errors = {};
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === "")) {
      errors[field] = "Este campo é obrigatório.";
    }
  }
  return errors;
}

export function validateNoNumbers(value) {
  return !/\d/.test(value);
}

export function formatDateToInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateToDisplay(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function formatCurrency(value) {
  if (isNaN(parseFloat(value))) return "";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(parseFloat(value));
}

export const handlePrint = () => {
  alert("A funcionalidade de impressão/visualização de PDF está em desenvolvimento. Nesta versão de demonstração, ela não gera um PDF real, mas simula a ação.");
};