# İrem Balkuv, 2200004679
# Gives the pandoc tables real column widths (pandoc writes plain "ll" columns for these tables).
import re,sys
p=sys.argv[1]; s=open(p).read()
widths={2:[[.30,.66],[.45,.51]],3:[[.21,.34,.37]],4:[[.16,.14,.29,.33]],5:[[.04,.19,.29,.10,.27]]}
used={2:0,3:0,4:0,5:0}
def col(w): return r'>{\raggedright\arraybackslash}p{%.2f\linewidth}'%w
def rep(m):
    n=len(m.group(1)); ws=widths[n][min(used[n],len(widths[n])-1)]; used[n]+=1
    return r'\begin{longtable}[]{@{}'+''.join(col(w) for w in ws)+'@{}}'
s,k=re.subn(r'\\begin\{longtable\}\[\]\{@\{\}(l+)@\{\}\}',rep,s)
s=s.replace(r'\begin{longtable}',r'{\small\begin{longtable}').replace(r'\end{longtable}',r'\end{longtable}}')
open(p,'w').write(s); print('tables',k,used)
